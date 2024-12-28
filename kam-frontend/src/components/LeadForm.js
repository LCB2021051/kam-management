import React, { useState } from "react";
import { createLead } from "../services/api";
import { useNavigate } from "react-router-dom";

const LeadForm = ({ onLeadAdded }) => {
  const [formData, setFormData] = useState({
    restaurantName: "",
    address: "",
    leadName: "",
    email: "",
    number: "",
    notificationFrequency: 7, // Default to 7 days
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
        restaurantName: "",
        address: "",
        leadName: "",
        email: "",
        number: "",
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
    <form onSubmit={handleSubmit} className="m-10">
      <h3 className="text-lg font-bold mb-6 text-center">Add New Lead</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Left Column: Restaurant Information */}
        <div>
          <h4 className="text-md font-semibold mb-4">Restaurant Information</h4>
          <div className="mb-4">
            <label className="block mb-1">Restaurant Name</label>
            <input
              type="text"
              name="restaurantName"
              value={formData.restaurantName}
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
        </div>

        {/* Right Column: Lead User Information */}
        <div>
          <h4 className="text-md font-semibold mb-4">Lead User Information</h4>
          <div className="mb-4">
            <label className="block mb-1">Lead Name</label>
            <input
              type="text"
              name="leadName"
              value={formData.leadName}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
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
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Phone Number</label>
            <input
              type="text"
              name="number"
              value={formData.number}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>
      </div>

      {/* Add and Cancel Buttons */}
      <div className="flex justify-end mt-6">
        <button
          type="button"
          onClick={handleCancel}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mr-4"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Lead
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
