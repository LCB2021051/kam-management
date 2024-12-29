const Interaction = require("../models/Interaction");
const User = require("../models/User");
const mongoose = require("mongoose");

// Add a new interaction
exports.addInteraction = async (req, res) => {
  try {
    const { restaurantId, type, about, from, to } = req.body;

    // Validate users
    const [fromUser, toUser] = await Promise.all([
      User.findById(from),
      User.findById(to),
    ]);

    if (!fromUser || !toUser) {
      return res
        .status(404)
        .json({ message: "Invalid sender or recipient ID." });
    }

    const interaction = new Interaction({
      restaurantId,
      type,
      about,
      from,
      to,
      time: new Date(),
    });

    await interaction.save();

    res.status(201).json({
      message: "Interaction added successfully",
      interaction: {
        ...interaction.toObject(),
        from: { _id: fromUser._id, name: fromUser.name, email: fromUser.email },
        to: { _id: toUser._id, name: toUser.name, email: toUser.email },
      },
    });
  } catch (error) {
    console.error("Error adding interaction:", error.message);
    res
      .status(500)
      .json({ message: "Error adding interaction", error: error.message });
  }
};

// Get interactions by restaurant ID
exports.getInteractions = async (req, res) => {
  const { restaurantId } = req.params;

  try {
    // Validate restaurantId
    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res.status(400).json({ message: "Invalid restaurant ID." });
    }

    // Fetch interactions from the database
    const interactions = await Interaction.find({ restaurantId })
      .populate("from", "name email")
      .populate("to", "name email")
      .sort({ time: -1 })
      .limit(10);

    // Check if interactions exist
    if (!interactions || interactions.length === 0) {
      return res.status(404).json({ message: "No interactions found." });
    }

    // Return interactions
    res.status(200).json({
      message: "Interactions retrieved successfully.",
      interactions: interactions.map((interaction) => ({
        id: interaction._id,
        restaurantId: interaction.restaurantId,
        type: interaction.type,
        about: interaction.about,
        from: interaction.from,
        to: interaction.to,
        time: interaction.time,
      })),
    });
  } catch (error) {
    console.error("Error fetching interactions:", error.message);
    res.status(500).json({
      message: "Error fetching interactions.",
      error: error.message,
    });
  }
};
