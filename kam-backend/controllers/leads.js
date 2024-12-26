const Lead = require("../models/Lead");
const Call = require("../models/Call");
const Order = require("../models/Order");
const Interaction = require("../models/Interaction");
const bcrypt = require("bcrypt");

const mongoose = require("mongoose");

// Create a new lead
exports.createLead = async (req, res) => {
  try {
    // Extract data from the request
    const { name, address, contactNumber, assignedKAM, contacts } = req.body;

    // Generate credentials
    const username = name.toLowerCase().replace(/\s+/g, "_"); // Username from name
    const password = Math.random().toString(36).slice(-8); // Random 8-character password

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the lead with the generated credentials
    const lead = new Lead({
      name,
      address,
      contactNumber,
      status: "New",
      assignedKAM,
      contacts,
      username,
      password: hashedPassword,
    });

    await lead.save();

    // Credentials
    console.log("Credentials: ", username, " ", password);

    // Return the lead details and plain-text password
    res.status(201).json({
      message: "Lead created successfully",
      lead: {
        id: lead._id,
        name: lead.name,
        assignedKAM: lead.assignedKAM,
        status: lead.status,
      },
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update a lead
exports.updateLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.json(lead);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a lead
exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.json({ message: "Lead deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments();
    const newLeads = await Lead.countDocuments({ status: "New" });
    const activeLeads = await Lead.countDocuments({ status: "Active" });
    const inactiveLeads = await Lead.countDocuments({ status: "Inactive" });

    // Aggregate leads with their last interaction time
    const recentLeads = await Lead.aggregate([
      {
        $lookup: {
          from: "interactions", // Use interactions collection
          localField: "_id",
          foreignField: "restaurantId",
          as: "interactions",
        },
      },
      {
        $addFields: {
          lastInteractionTime: {
            $max: "$interactions.time", // Get the latest interaction time
          },
        },
      },
      {
        $sort: {
          lastInteractionTime: -1, // Sort by latest interaction time
        },
      },
      {
        $limit: 5, // Limit to 5 recent leads
      },
      {
        $project: {
          name: 1,
          address: 1,
          contactNumber: 1,
          status: 1,
          lastInteractionTime: 1, // Include the latest interaction time
        },
      },
    ]);

    res.json({
      totalLeads,
      newLeads,
      activeLeads,
      inactiveLeads,
      recentLeads,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching dashboard stats",
      error: err.message,
    });
  }
};

// Helper function to calculate average interactions
const calculateAverageInteractions = async (restaurantId) => {
  const interactionData = await Interaction.aggregate([
    {
      $match: { restaurantId: new mongoose.Types.ObjectId(restaurantId) },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$time" },
        },
      },
    },
  ]);

  const totalInteractions = await Interaction.countDocuments({ restaurantId });
  const totalInteractionDays = interactionData.length;

  return totalInteractionDays > 0
    ? Math.floor(totalInteractions / totalInteractionDays)
    : 0;
};

const getLastInteractionTime = async (leadId) => {
  const lastInteraction = await Interaction.findOne({ restaurantId: leadId })
    .sort({ time: -1 }) // Sort by time descending
    .select("time"); // Only fetch the `time` field
  return lastInteraction ? lastInteraction.time : null;
};

// Helper function to calculate average orders
const calculateAverageOrders = async (restaurantId) => {
  const orderData = await Order.aggregate([
    {
      $match: { restaurantId: new mongoose.Types.ObjectId(restaurantId) },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
        },
      },
    },
  ]);

  const totalOrders = await Order.countDocuments({ restaurantId });
  const totalOrderDays = orderData.length;

  return totalOrderDays > 0 ? Math.floor(totalOrders / totalOrderDays) : 0;
};

// Main getLeads function
exports.getLeads = async (req, res) => {
  try {
    const { sortBy } = req.query; // Retrieve the sortBy parameter from the query string

    // Fetch all leads
    const leads = await Lead.find();

    // Enrich leads with calculated metrics
    const enrichedLeads = await Promise.all(
      leads.map(async (lead) => {
        const averageInteractions = await calculateAverageInteractions(
          lead._id
        );
        const averageOrders = await calculateAverageOrders(lead._id);
        const lastInteractionTime = await getLastInteractionTime(lead._id);

        return {
          ...lead.toObject(),
          averageInteractions,
          averageOrders,
          lastInteractionTime,
        };
      })
    );

    // Sort enriched leads dynamically
    enrichedLeads.sort((a, b) => {
      if (sortBy === "averageInteractions") {
        return b.averageInteractions - a.averageInteractions;
      } else if (sortBy === "averageOrders") {
        return b.averageOrders - a.averageOrders;
      } else {
        return (
          new Date(b.lastInteractionTime) - new Date(a.lastInteractionTime)
        ); // Default: Sort by lastInteractionTime
      }
    });

    res.status(200).json(enrichedLeads);
  } catch (err) {
    console.error("Error fetching leads:", err.message);
    res
      .status(500)
      .json({ message: "Error fetching leads", error: err.message });
  }
};

exports.addContact = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    // Validate incoming contact data
    const { name, role, phone, email } = req.body;
    if (!name || !role || !phone || !email) {
      console.error("Invalid Contact Data:", req.body);
      return res.status(400).json({ message: "Invalid contact data" });
    }

    // Add the validated contact
    lead.contacts.push({ name, role, phone, email });
    await lead.save();
    res.status(201).json(lead);
  } catch (err) {
    console.error("Error adding contact:", err.message);
    res.status(400).json({ message: err.message });
  }
};

exports.deleteContact = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    // Remove the contact with the specified ID
    lead.contacts = lead.contacts.filter(
      (contact) => contact._id.toString() !== req.params.contactId
    );
    await lead.save();
    res.json(lead);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getLeadById = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the lead by ID in the database
    const lead = await Lead.findById(id);

    if (!lead) {
      return res.status(404).json({ error: "Lead not found" });
    }

    // Return the lead data
    res.json(lead);
  } catch (error) {
    console.error("Error fetching lead by ID:", error.message);
    res.status(500).json({ error: "Server error while fetching lead" });
  }
};

exports.getLeadStats = async (req, res) => {
  const { id } = req.params;

  try {
    // Interactions made today
    const interactionsToday = await Interaction.countDocuments({
      restaurantId: id,
      time: {
        $gte: new Date().setHours(0, 0, 0, 0),
        $lte: new Date(),
      },
    });

    // Orders completed today
    const ordersToday = await Order.countDocuments({
      restaurantId: id,
      status: "Completed",
      createdAt: {
        $gte: new Date().setHours(0, 0, 0, 0),
        $lte: new Date(),
      },
    });

    // Average interactions per day
    const averageInteractions = await calculateAverageInteractions(id);

    // Average orders per day
    const averageOrders = await calculateAverageOrders(id);

    // Pending orders
    const pendingOrders = await Order.countDocuments({
      restaurantId: id,
      status: "Pending",
    });

    // Last interaction time
    const lastInteractionTime = await getLastInteractionTime(id);

    res.status(200).json({
      interactionsToday,
      ordersToday,
      averageInteractions,
      averageOrders,
      pendingOrders,
      lastInteractionTime,
    });
  } catch (error) {
    console.error("Error fetching lead statistics:", error.message);

    res.status(500).json({
      message: "Error fetching lead statistics",
      error: error.message,
    });
  }
};
