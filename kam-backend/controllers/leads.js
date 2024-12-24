const Lead = require("../models/Lead");
const bcrypt = require("bcrypt");

// Get all leads
exports.getLeads = async (req, res) => {
  try {
    const leads = await Lead.find();
    res.json(leads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

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
      status: "New", // Default status
      assignedKAM,
      contacts,
      username,
      password: hashedPassword, // Store hashed password
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
    const recentLeads = await Lead.find().sort({ _id: -1 }).limit(5);

    res.json({
      totalLeads,
      newLeads,
      activeLeads,
      inactiveLeads,
      recentLeads,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
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
      console.error("Invalid Contact Data:", req.body); // Log invalid data
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
    const lead = await Lead.findById(req.params.id); // Find lead by ID
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    // Remove the contact with the specified ID
    lead.contacts = lead.contacts.filter(
      (contact) => contact._id.toString() !== req.params.contactId
    );
    await lead.save(); // Save the updated lead
    res.json(lead); // Return the updated lead
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
