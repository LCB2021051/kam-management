const Call = require("../models/Call");

exports.simulateCall = async (req, res) => {
  const { restaurantId } = req.body; // Get restaurant ID from request body

  try {
    const call = new Call({
      restaurantId,
    });

    await call.save();

    res.status(201).json({ message: "Call simulated successfully", call });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error simulating call", error: error.message });
  }
};
