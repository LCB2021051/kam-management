import React, { useState } from "react";
import { createLead } from "../services/api";
import { useNavigate } from "react-router-dom";

const LeadForm = ({ onLeadAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    contactNumber: "",
    status: "New",
    assignedKAM: "",
    notificationFrequency: 7, // Default notification frequency
  });

  const navigate = useNavigate(); // Hook to navigate programmatically

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createLead(formData);
      if (onLeadAdded) {
        onLeadAdded(response);
      }

      setFormData({
        name: "",
        address: "",
        contactNumber: "",
        status: "New",
        assignedKAM: "",
        notificationFrequency: 7,
      });

      navigate(`/leads/${response.lead.id}`);
    } catch (error) {
      console.error("Error creating lead:", error.message);
    }
  };

  const handleCancel = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-100 rounded">
      <h3 className="text-lg font-bold mb-4">Add New Lead</h3>
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
        <label className="block mb-1">Address</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Contact Number</label>
        <input
          type="text"
          name="contactNumber"
          value={formData.contactNumber}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Assigned KAM</label>
        <input
          type="text"
          name="assignedKAM"
          value={formData.assignedKAM}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Notification Frequency (Days)</label>
        <input
          type="number"
          name="notificationFrequency"
          value={formData.notificationFrequency}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          min="1"
          required
        />
      </div>
      <div className="flex space-x-4">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Lead
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

// Define default props after the component declaration
LeadForm.defaultProps = {
  onLeadAdded: null, // Set to null if not provided
};

export default LeadForm;
