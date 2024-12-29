const Lead = require("../models/Lead");
const Order = require("../models/Order");
const Interaction = require("../models/Interaction");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const mongoose = require("mongoose");

// Create a new lead
exports.createLead = async (req, res) => {
  try {
    const {
      restaurantName,
      address,
      leadName,
      email,
      number,
      notificationFrequency = 7, // Default to 7 days if not provided
    } = req.body;

    // Validate required fields
    if (!restaurantName || !leadName || !email || !number) {
      return res.status(400).json({
        message:
          "Restaurant name, lead name, email, and phone number are required.",
      });
    }

    // Check if email or phone number already exists
    const existingUser = await User.findOne({ $or: [{ email }, { number }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email or phone number is already in use." });
    }

    // Generate credentials for the lead user
    const password = Math.random().toString(36).slice(-8); // Generate a random password

    // Create the lead user
    const leadUser = new User({
      name: leadName,
      email,
      number,
      role: "lead",
      password,
    });

    // Save lead user
    await leadUser.save();

    // Log credentials
    console.log("Credentials:", email, password);

    // Create the restaurant
    const restaurant = new Lead({
      name: restaurantName,
      address,
      leadUser: leadUser._id, // Associate the lead user with the restaurant
      status: "New",
      contacts: [],
      notificationFrequency, // Include notification frequency
    });

    // Save restaurant
    await restaurant.save();

    // Update the user's `restaurantId` field
    leadUser.restaurantId = restaurant._id;
    await leadUser.save();

    // Respond with success and credentials
    res.status(201).json({
      message: "Lead created successfully",
      lead: {
        id: restaurant._id,
        name: restaurant.name,
        address: restaurant.address,
        leadName,
        email: leadUser.email,
        number: leadUser.number,
        status: restaurant.status,
        notificationFrequency: restaurant.notificationFrequency,
      },
      credentials: {
        email: leadUser.email,
        password,
      },
    });
  } catch (error) {
    console.error("Error creating lead:", error.message);
    res
      .status(500)
      .json({ message: "Error creating lead", error: error.message });
  }
};

// Update a lead
exports.updateLead = async (req, res) => {
  try {
    const {
      restaurantName,
      address,
      leadName,
      email,
      number,
      notificationFrequency,
    } = req.body;

    // Validate input data
    if (!restaurantName || !leadName || !email || !number) {
      return res.status(400).json({
        message:
          "Restaurant name, lead name, email, and phone number are required.",
      });
    }

    // Find the existing lead
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    // Find the associated lead user by ID
    const leadUser = await User.findById(lead.leadUser);
    if (!leadUser) {
      return res.status(404).json({ message: "Lead user not found" });
    }

    // Update the lead user details
    leadUser.name = leadName;
    leadUser.email = email;
    leadUser.number = number;
    await leadUser.save();

    // Update lead details
    lead.name = restaurantName;
    lead.address = address;
    lead.notificationFrequency = notificationFrequency;
    await lead.save();

    res.json({
      message: "Lead and lead user updated successfully",
      lead: {
        id: lead._id,
        name: lead.name,
        address: lead.address,
        leadName: leadUser.name,
        email: leadUser.email,
        number: leadUser.number,
        status: lead.status,
        notificationFrequency: lead.notificationFrequency,
      },
    });
  } catch (error) {
    console.error("Error updating lead:", error.message);
    res
      .status(500)
      .json({ message: "Error updating lead", error: error.message });
  }
};

// Delete a lead
exports.deleteLead = async (req, res) => {
  try {
    // Find the lead by ID
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    // Delete the associated leadUser
    if (lead.leadUser) {
      await User.findByIdAndDelete(lead.leadUser);
    }

    // Delete all users in the contacts array
    if (lead.contacts && lead.contacts.length > 0) {
      await User.deleteMany({ _id: { $in: lead.contacts } });
    }

    // Delete the lead
    await Lead.findByIdAndDelete(req.params.id);

    res.json({
      message: "Lead, associated lead user, and contacts deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting lead:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// dashboard Stats
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

  const totalOrderDays = orderData.length;

  const [completedOrders, canceledOrders] = await Promise.all([
    Order.countDocuments({ restaurantId, status: "Completed" }),
    Order.countDocuments({ restaurantId, status: "Cancelled" }),
  ]);

  return {
    averageCompletedOrders:
      totalOrderDays > 0 ? Math.floor(completedOrders / totalOrderDays) : 0,
    averageCanceledOrders:
      totalOrderDays > 0 ? Math.floor(canceledOrders / totalOrderDays) : 0,
  };
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
        const { averageCompletedOrders, averageCanceledOrders } =
          await calculateAverageOrders(lead._id);
        const lastInteractionTime = await getLastInteractionTime(lead._id);
        const averageOrders = averageCompletedOrders;
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
    const { name, role, number, email } = req.body;
    if (!name || !role || !number || !email) {
      console.error("Invalid Contact Data:", req.body);
      return res.status(400).json({ message: "Invalid contact data" });
    }

    // Check if the contact already exists by email or phone
    const existingContact = await User.findOne({
      $or: [{ email }, { number }],
    });

    if (existingContact) {
      return res.status(400).json({
        message: "Contact with this email or phone number already exists.",
      });
    }

    // Generate a random password if the role is `manager`
    let password;
    let hashedPassword;

    if (role === "manager") {
      password = Math.random().toString(36).slice(-8); // Generate random 8-character password
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Create a new contact as a user
    const newContact = new User({
      name,
      role,
      email,
      number,
      restaurantId: lead._id, // Associate contact with the lead
      ...(role === "manager" && { password: hashedPassword }), // Add password if role is `manager`
    });

    await newContact.save();

    // Add the contact to the lead's contacts array
    lead.contacts.push(newContact._id);
    await lead.save();

    const response = {
      message: "Contact added successfully",
      contact: newContact,
    };

    // Include credentials if the contact is a manager
    if (role === "manager") {
      console.log("Credentials :", newContact.email, password);
      response.credentials = {
        email: newContact.email,
        password,
      };
    }

    res.status(201).json(response);
  } catch (err) {
    console.error("Error adding contact:", err.message);
    res
      .status(500)
      .json({ message: "Error adding contact", error: err.message });
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
    // Find the lead by ID
    const lead = await Lead.findById(id).populate(
      "leadUser",
      "name email number"
    );

    if (!lead) {
      return res.status(404).json({ error: "Lead not found" });
    }

    // Fetch contacts from the User model based on the contacts array in Lead
    let contacts = [];
    if (lead.contacts && lead.contacts.length > 0) {
      contacts = await User.find(
        { _id: { $in: lead.contacts } },
        "name email number role"
      );
    }

    // Structure the response to include leadUser and contacts
    const response = {
      ...lead.toObject(),
      leadUser: lead.leadUser,
      contacts,
    };

    res.json(response);
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
    const { averageCompletedOrders, averageCanceledOrders } =
      await calculateAverageOrders(id);

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
      averageCompletedOrders,
      averageCanceledOrders,
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

const calculateNextInteractionDueById = async (restaurantId) => {
  try {
    const lead = await Lead.findById(restaurantId);

    if (!lead) {
      throw new Error("Lead not found");
    }

    // Fetch the last "Regular-Update" interaction
    const lastRegularUpdate = await Interaction.findOne({
      restaurantId,
      type: "Regular-Update",
    })
      .sort({ time: -1 })
      .select("time");

    // Get the last interaction date (rounded to the start of the day)
    const lastInteractionDate = lastRegularUpdate
      ? new Date(lastRegularUpdate.time.setHours(0, 0, 0, 0))
      : null;

    // Calculate the next interaction due date (start of the day)
    const nextInteractionDue = lastInteractionDate
      ? new Date(
          lastInteractionDate.getTime() +
            lead.notificationFrequency * 24 * 60 * 60 * 1000
        )
      : new Date(new Date().setHours(0, 0, 0, 0)); // Default to today

    // Return next interaction due as a Date object
    return { nextInteractionDue };
  } catch (error) {
    console.error("Error calculating next interaction due:", error.message);
    throw new Error("Unable to calculate next interaction due.");
  }
};

// Controller to fetch leads requiring interaction today
exports.getLeadsForInteraction = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const leads = await Lead.find();

    const leadsRequiringInteraction = await Promise.all(
      leads.map(async (lead) => {
        const { nextInteractionDue } = await calculateNextInteractionDueById(
          lead._id
        );

        if (today >= nextInteractionDue) {
          return {
            id: lead._id,
            name: lead.name,
            address: lead.address,
            contactNumber: lead.contactNumber,
            assignedKAM: lead.assignedKAM,
            nextInteractionDue,
          };
        }

        return null;
      })
    );

    const filteredLeads = leadsRequiringInteraction.filter(Boolean);

    res.status(200).json({
      message: "Leads requiring interaction",
      data: filteredLeads,
    });
  } catch (error) {
    console.error("Error fetching leads for interaction:", error.message);
    res.status(500).json({
      message: "Error fetching leads for interaction",
      error: error.message,
    });
  }
};

// Controller to get the next interaction due for a specific lead
exports.getNextInteractionDue = async (req, res) => {
  const { id } = req.params;

  try {
    const { nextInteractionDue } = await calculateNextInteractionDueById(id);

    res.status(200).json({
      message: "Next interaction due date fetched successfully",
      data: { nextInteractionDue }, // Return as a Date object
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching next interaction due date",
      error: error.message,
    });
  }
};

// Helper function to calculate average metrics
exports.getPerformanceMetrics = async (req, res) => {
  try {
    // Fetch all leads
    const leads = await Lead.find();

    // Calculate performance metrics for each lead
    const performanceMetrics = await Promise.all(
      leads.map(async (lead) => {
        // Calculate average interactions and orders
        const [averageOrders, averageInteractions] = await Promise.all([
          calculateAverageOrders(lead._id),
          calculateAverageInteractions(lead._id),
        ]);

        // Calculate Weighted Score
        const weightedScore =
          averageOrders.averageCompletedOrders * 2 -
          averageOrders.averageCanceledOrders * 1 +
          averageInteractions * 0.5;

        return {
          id: lead._id,
          name: lead.name,
          averageCompletedOrders: averageOrders.averageCompletedOrders,
          averageCanceledOrders: averageOrders.averageCanceledOrders,
          averageInteractions,
          weightedScore,
        };
      })
    );

    // Calculate maximum score for Performance Index
    const maxScore = Math.max(
      ...performanceMetrics.map((m) => m.weightedScore)
    );

    // Add Performance Index to each lead's metrics
    const enrichedMetrics = performanceMetrics.map((metric) => ({
      ...metric,
      performanceIndex:
        maxScore > 0 ? ((metric.weightedScore / maxScore) * 100).toFixed(2) : 0,
    }));

    // Sort metrics by Weighted Score in descending order
    enrichedMetrics.sort((a, b) => b.weightedScore - a.weightedScore);

    res.status(200).json({
      message: "Performance metrics fetched successfully",
      data: enrichedMetrics,
    });
  } catch (error) {
    console.error("Error fetching performance metrics:", error.message);
    res.status(500).json({
      message: "Error fetching performance metrics",
      error: error.message,
    });
  }
};
