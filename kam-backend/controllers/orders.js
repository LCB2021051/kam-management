const Order = require("../models/Order");

// Simulate Order
exports.simulateOrder = async (req, res) => {
  const { restaurantId, items } = req.body;

  if (!restaurantId || !items || items.length === 0) {
    return res
      .status(400)
      .json({ message: "Restaurant ID and items are required." });
  }

  try {
    const order = new Order({
      restaurantId,
      transactionId: `TXN${Date.now()}`,
      amount: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      status: "Pending",
      items,
    });

    await order.save();

    res.status(201).json({ message: "Order simulated successfully", order });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error simulating order", error: error.message });
  }
};

// Fetch Pending Orders
exports.pendingOrders = async (req, res) => {
  const { restaurantId } = req.query;

  if (!restaurantId) {
    return res
      .status(400)
      .json({ message: "Restaurant ID is required to fetch pending orders." });
  }

  try {
    const pendingOrders = await Order.find({
      restaurantId,
      status: "Pending",
    });

    res.status(200).json(pendingOrders);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching pending orders",
      error: error.message,
    });
  }
};

// Mark Order as Complete/Canclled
exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!id) {
    return res
      .status(400)
      .json({ message: "Order ID is required to update status." });
  }

  if (!status) {
    return res
      .status(400)
      .json({ message: "Status is required to update the order." });
  }

  const validStatuses = ["Completed", "Cancelled", "Pending"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      message: `Invalid status. Allowed statuses are: ${validStatuses.join(
        ", "
      )}`,
    });
  }

  try {
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: `Order marked as ${status}`, order });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating order status", error: error.message });
  }
};
