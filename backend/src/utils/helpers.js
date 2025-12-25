// Generate order number
export const generateOrderNumber = async (Order) => {
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');
  
  // Get the last order number for today
  const lastOrder = await Order.findOne({
    orderNumber: { $regex: `^${dateStr}` },
  }).sort({ orderNumber: -1 });

  let sequence = 1;
  if (lastOrder) {
    const lastSequence = parseInt(lastOrder.orderNumber.slice(-3));
    sequence = lastSequence + 1;
  }

  const orderNumber = `${dateStr}${sequence.toString().padStart(3, '0')}`;
  return orderNumber;
};

// Calculate order totals
export const calculateOrderTotals = (items, taxRate, discountPercent = 0) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = subtotal * (discountPercent / 100);
  const taxableAmount = subtotal - discountAmount;
  const tax = taxableAmount * (taxRate / 100);
  const total = taxableAmount + tax;

  return {
    subtotal,
    discount: discountAmount,
    tax,
    total,
  };
};

