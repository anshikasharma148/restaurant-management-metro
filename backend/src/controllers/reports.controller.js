import Order from '../models/Order.js';
import Payment from '../models/Payment.js';
import MenuItem from '../models/MenuItem.js';

export const getSalesSummary = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const query = { status: 'completed' };

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        query.createdAt.$gte = start;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // Include full end date
        query.createdAt.$lte = end;
      }
    } else {
      // Default to today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const endOfToday = new Date(today);
      endOfToday.setHours(23, 59, 59, 999);
      query.createdAt = { $gte: today, $lte: endOfToday };
    }

    const orders = await Order.find(query);

    const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

    res.status(200).json({
      success: true,
      data: {
        totalSales,
        totalOrders,
        averageOrderValue,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getTopItems = async (req, res, next) => {
  try {
    const { startDate, endDate, limit = 10 } = req.query;
    const query = { status: 'completed' };

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        query.createdAt.$gte = start;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // Include full end date
        query.createdAt.$lte = end;
      }
    } else {
      // Default to today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const endOfToday = new Date(today);
      endOfToday.setHours(23, 59, 59, 999);
      query.createdAt = { $gte: today, $lte: endOfToday };
    }

    const orders = await Order.find(query);

    // Aggregate item sales
    const itemSales = {};
    orders.forEach((order) => {
      order.items.forEach((item) => {
        const key = item.name;
        if (!itemSales[key]) {
          itemSales[key] = {
            name: item.name,
            quantity: 0,
            revenue: 0,
          };
        }
        itemSales[key].quantity += item.quantity;
        itemSales[key].revenue += item.price * item.quantity;
      });
    });

    const topItems = Object.values(itemSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, parseInt(limit));

    res.status(200).json({
      success: true,
      data: topItems,
    });
  } catch (error) {
    next(error);
  }
};

export const getCategorySales = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const query = { status: 'completed' };

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        query.createdAt.$gte = start;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // Include full end date
        query.createdAt.$lte = end;
      }
    } else {
      // Default to today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const endOfToday = new Date(today);
      endOfToday.setHours(23, 59, 59, 999);
      query.createdAt = { $gte: today, $lte: endOfToday };
    }

    const orders = await Order.find(query).populate({
      path: 'items.menuItemId',
      populate: { path: 'category' },
    });

    const categorySales = {};

    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (item.menuItemId && item.menuItemId.category) {
          const categoryName = item.menuItemId.category.name;
          if (!categorySales[categoryName]) {
            categorySales[categoryName] = {
              name: categoryName,
              orders: 0,
              revenue: 0,
            };
          }
          categorySales[categoryName].revenue += item.price * item.quantity;
        }
      });
      // Count unique orders per category
      const categoriesInOrder = new Set();
      order.items.forEach((item) => {
        if (item.menuItemId && item.menuItemId.category) {
          categoriesInOrder.add(item.menuItemId.category.name);
        }
      });
      categoriesInOrder.forEach((catName) => {
        if (categorySales[catName]) {
          categorySales[catName].orders += 1;
        }
      });
    });

    const result = Object.values(categorySales).sort((a, b) => b.revenue - a.revenue);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getDashboardStats = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Today's sales
    const todayOrders = await Order.find({
      status: 'completed',
      createdAt: { $gte: today },
    });

    const todaySales = todayOrders.reduce((sum, order) => sum + order.total, 0);
    const todayOrderCount = todayOrders.length;

    // Active orders
    const activeOrders = await Order.find({
      status: { $in: ['pending', 'preparing'] },
    });

    const pendingCount = activeOrders.filter((o) => o.status === 'pending').length;
    const preparingCount = activeOrders.filter((o) => o.status === 'preparing').length;

    // Yesterday's sales for comparison
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayOrders = await Order.find({
      status: 'completed',
      createdAt: { $gte: yesterday, $lt: today },
    });
    const yesterdaySales = yesterdayOrders.reduce((sum, order) => sum + order.total, 0);
    const salesTrend = yesterdaySales > 0 ? ((todaySales - yesterdaySales) / yesterdaySales) * 100 : 0;

    res.status(200).json({
      success: true,
      data: {
        todaySales,
        todayOrders: todayOrderCount,
        activeOrders: activeOrders.length,
        pendingOrders: pendingCount,
        preparingOrders: preparingCount,
        salesTrend,
      },
    });
  } catch (error) {
    next(error);
  }
};

