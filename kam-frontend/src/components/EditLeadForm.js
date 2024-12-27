import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import hooks
import { getLeadById, updateLead } from "../services/api"; // Import required API functions

const EditLeadForm = () => {
  const { id } = useParams(); // Extract lead ID from URL params
  const navigate = useNavigate(); // For navigation after update
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    contactNumber: "",
    status: "New",
    assignedKAM: "",
    notificationFrequency: 7, // Default frequency in days
  });

  // Fetch lead data based on ID
  useEffect(() => {
    const fetchLead = async () => {
      try {
        const lead = await getLeadById(id); // API call to fetch lead data
        setFormData({
          name: lead.name || "",
          address: lead.address || "",
          contactNumber: lead.contactNumber || "",
          status: lead.status || "New",
          assignedKAM: lead.assignedKAM || "",
          notificationFrequency: lead.notificationFrequency || 7, // Set default if not present
        });
      } catch (error) {
        console.error("Error fetching lead:", error.message);
      }
    };
    fetchLead();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateLead(id, formData); // Call API to update the lead
      navigate(`/leads/${id}`); // Redirect back to the lead's page
    } catch (error) {
      console.error("Error updating lead:", error.message);
    }
  };

  const handleCancel = () => {
    navigate(`/leads/${id}`); // Redirect back without saving
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-100 rounded">
      <h3 className="text-lg font-bold mb-4">Edit Lead</h3>
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
        <label className="block mb-1">Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="New">New</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
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
          Update Lead
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditLeadForm;
