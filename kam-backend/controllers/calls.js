const Call = require("../models/Call");

exports.simulateCall = async (req, res) => {
  const { restaurantId, to, from, about } = req.body; // Get required fields from the request body

  try {
    // Validate required fields
    if (!restaurantId || !to || !from || !about) {
      return res
        .status(400)
        .json({
          message: "All fields (restaurantId, to, from, about) are required.",
        });
    }

    // Create a new call
    const call = new Call({
      restaurantId,
      to,
      from,
      about,
    });

    await call.save();

    res.status(201).json({ message: "Call simulated successfully", call });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error simulating call", error: error.message });
  }
};
