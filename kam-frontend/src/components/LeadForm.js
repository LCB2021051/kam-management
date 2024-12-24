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
  });

  const navigate = useNavigate(); // Hook to navigate programmatically

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const Response = await createLead(formData);
      if (onLeadAdded) {
        onLeadAdded(Response);
      }

      setFormData({
        name: "",
        address: "",
        contactNumber: "",
        status: "New",
        assignedKAM: "",
      });

      navigate(`/leads/${Response.lead.id}`);
    } catch (error) {
      console.error("Error creating lead:", error.message);
    }
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
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add Lead
      </button>
    </form>
  );
};

// Define default props after the component declaration
LeadForm.defaultProps = {
  onLeadAdded: null, // Set to null if not provided
};

export default LeadForm;
