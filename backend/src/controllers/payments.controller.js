import Payment from '../models/Payment.js';
import Order from '../models/Order.js';

export const processPayment = async (req, res, next) => {
  try {
    const { orderId, method, receivedAmount } = req.body;

    if (!orderId || !method) {
      return res.status(400).json({
        success: false,
        error: 'Please provide orderId and payment method',
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found',
      });
    }

    if (order.status !== 'ready') {
      return res.status(400).json({
        success: false,
        error: 'Order must be ready for payment',
      });
    }

    // Check if payment already exists
    const existingPayment = await Payment.findOne({ orderId });
    if (existingPayment) {
      return res.status(400).json({
        success: false,
        error: 'Payment already processed for this order',
      });
    }

    let change = 0;
    if (method === 'cash' && receivedAmount) {
      change = receivedAmount - order.total;
      if (change < 0) {
        return res.status(400).json({
          success: false,
          error: 'Insufficient payment amount',
        });
      }
    }

    const payment = await Payment.create({
      orderId,
      method,
      amount: order.total,
      receivedAmount: method === 'cash' ? receivedAmount : order.total,
      change,
      processedBy: req.user._id,
    });

    // Update order status to completed
    order.status = 'completed';
    await order.save();

    await payment.populate('processedBy', 'name email');
    await payment.populate('orderId');

    res.status(201).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

export const getPayments = async (req, res, next) => {
  try {
    const { startDate, endDate, method } = req.query;
    const query = {};

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }
    if (method) {
      query.method = method;
    }

    const payments = await Payment.find(query)
      .populate('orderId')
      .populate('processedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (error) {
    next(error);
  }
};

export const getPayment = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('orderId')
      .populate('processedBy', 'name email');

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'Payment not found',
      });
    }

    res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

export const getPaymentByOrder = async (req, res, next) => {
  try {
    const payment = await Payment.findOne({ orderId: req.params.orderId })
      .populate('orderId')
      .populate('processedBy', 'name email');

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'Payment not found for this order',
      });
    }

    res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

