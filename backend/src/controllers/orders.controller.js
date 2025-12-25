import Order from '../models/Order.js';
import Table from '../models/Table.js';
import Settings from '../models/Settings.js';
import { generateOrderNumber, calculateOrderTotals } from '../utils/helpers.js';

export const getOrders = async (req, res, next) => {
  try {
    const { status, type, startDate, endDate } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    }
    if (type) {
      query.type = type;
    }
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }

    const orders = await Order.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('createdBy', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found',
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const createOrder = async (req, res, next) => {
  try {
    const { type, items, tableNumber, notes } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please provide at least one item',
      });
    }

    // Validate table if dine-in
    if (type === 'dine-in') {
      if (!tableNumber) {
        return res.status(400).json({
          success: false,
          error: 'Table number is required for dine-in orders',
        });
      }

      const table = await Table.findOne({ number: tableNumber });
      if (!table) {
        return res.status(404).json({
          success: false,
          error: 'Table not found',
        });
      }

      if (table.status !== 'available') {
        return res.status(400).json({
          success: false,
          error: 'Table is not available',
        });
      }

      // Update table status to occupied
      table.status = 'occupied';
      await table.save();
    }

    // Get settings for tax calculation
    const settings = await Settings.getSettings();

    // Calculate totals
    const totals = calculateOrderTotals(items, settings.taxRate, 0);

    // Generate order number
    const orderNumber = await generateOrderNumber(Order);

    const order = await Order.create({
      orderNumber,
      type,
      items,
      tableNumber: type === 'dine-in' ? tableNumber : null,
      notes: notes || '',
      subtotal: totals.subtotal,
      tax: totals.tax,
      discount: totals.discount,
      total: totals.total,
      createdBy: req.user._id,
    });

    await order.populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['pending', 'preparing', 'ready', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status',
      });
    }

    let order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found',
      });
    }

    order.status = status;
    await order.save();

    // If order is completed and it's a dine-in order, free up the table
    if (status === 'completed' && order.type === 'dine-in' && order.tableNumber) {
      const table = await Table.findOne({ number: order.tableNumber });
      if (table) {
        table.status = 'available';
        await table.save();
      }
    }

    await order.populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrder = async (req, res, next) => {
  try {
    let order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found',
      });
    }

    // Only allow updates if order is pending
    if (order.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: 'Can only update pending orders',
      });
    }

    const { items, notes, discount } = req.body;

    if (items && items.length > 0) {
      order.items = items;
      const settings = await Settings.getSettings();
      const totals = calculateOrderTotals(items, settings.taxRate, discount || 0);
      order.subtotal = totals.subtotal;
      order.tax = totals.tax;
      order.discount = totals.discount;
      order.total = totals.total;
    }

    if (notes !== undefined) {
      order.notes = notes;
    }

    await order.save();
    await order.populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found',
      });
    }

    // Free up table if dine-in
    if (order.type === 'dine-in' && order.tableNumber) {
      const table = await Table.findOne({ number: order.tableNumber });
      if (table) {
        table.status = 'available';
        await table.save();
      }
    }

    await order.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

