import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLeadById, updateLead } from "../services/api";

const EditLeadForm = () => {
  const { id } = useParams(); // Extract lead ID from URL params
  const navigate = useNavigate(); // For navigation after update
  const [formData, setFormData] = useState({
    restaurantName: "",
    address: "",
    leadName: "",
    email: "",
    number: "",
    status: "New", // Default status
    notificationFrequency: 7, // Default notification frequency
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch lead data based on ID
  useEffect(() => {
    const fetchLead = async () => {
      try {
        const lead = await getLeadById(id);
        setFormData({
          restaurantName: lead.name || "",
          address: lead.address || "",
          leadName: lead.leadUser?.name || "",
          email: lead.leadUser?.email || "",
          number: lead.leadUser?.number || "",
          status: lead.status || "New",
          notificationFrequency: lead.notificationFrequency || 7,
        });
        setError("");
      } catch (err) {
        console.error("Error fetching lead:", err.message);
        setError("Failed to load lead details.");
      } finally {
        setLoading(false);
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
    } catch (err) {
      console.error("Error updating lead:", err.message);
      setError("Failed to update lead.");
    }
  };

  const handleCancel = () => {
    navigate(`/leads/${id}`); // Redirect back without saving
  };

  if (loading) {
    return <p>Loading lead details...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-gray-100 rounded">
      <h3 className="text-lg font-bold mb-4">Edit Lead</h3>

      {/* Left Section: Restaurant Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="text-md font-semibold mb-2">Restaurant Info</h4>
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
        </div>

        {/* Right Section: Lead User Info */}
        <div>
          <h4 className="text-md font-semibold mb-2">Lead User Info</h4>
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

      <div className="flex justify-end space-x-4 mt-6">
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
