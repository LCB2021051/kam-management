import React, { useState } from "react";
import { addContactToLead } from "../services/api";

const ContactForm = ({ leadId, onContactAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    phone: "",
    email: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure all fields are filled
    if (
      !formData.name ||
      !formData.role ||
      !formData.phone ||
      !formData.email
    ) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const updatedLead = await addContactToLead(leadId, formData); // API call
      onContactAdded(leadId, updatedLead); // Notify parent with updated lead
      setFormData({
        name: "",
        role: "",
        phone: "",
        email: "",
      }); // Reset form
    } catch (err) {
      console.error("Error submitting contact:", err.message);
      alert("Failed to add contact. Please check your input.");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-100 rounded">
      <h3 className="text-lg font-bold mb-4">Add Contact</h3>
      <div className="mb-4">
        <label className="block mb-1">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Role</label>
        <input
          type="text"
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Phone</label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add Contact
      </button>
    </form>
  );
};

export default ContactForm;
