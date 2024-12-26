const Interaction = require("../models/Interaction");

// Add a new interaction
exports.addInteraction = async (req, res) => {
  try {
    const { restaurantId, type, about, from, to } = req.body;

    const interaction = new Interaction({
      restaurantId,
      type,
      about,
      from,
      to,
      time: new Date(), // Explicitly set the current date and time
    });

    await interaction.save();
    res.status(201).json(interaction);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding interaction", error: error.message });
  }
};

// Get interactions by restaurant ID
exports.getInteractions = async (req, res) => {
  const { restaurantId } = req.params;

  try {
    // Fetch the most recent 10 interactions for the given restaurant
    const interactions = await Interaction.find({ restaurantId })
      .sort({ time: -1 })
      .limit(10);

    if (!interactions.length) {
      return res.status(404).json({
        message: "No interactions found for the given restaurant.",
      });
    }

    res.status(200).json(interactions);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching interactions",
      error: error.message,
    });
  }
};
