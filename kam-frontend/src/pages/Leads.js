import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getLeads, deleteLead } from "../services/api";

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const navigate = useNavigate();

  // Fetch leads on component mount
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const data = await getLeads();
        setLeads(data);
      } catch (error) {
        console.error("Error fetching leads:", error.message);
      }
    };
    fetchLeads();
  }, []);

  const handleDeleteLead = async (id) => {
    try {
      await deleteLead(id); // Call API to delete the lead
      setLeads((prevLeads) => prevLeads.filter((lead) => lead._id !== id)); // Remove lead from the list
    } catch (error) {
      console.error("Error deleting lead:", error.message);
    }
  };

  const handleEditLead = (id) => {
    navigate(`/leads/${id}`);
  };

  const formatTimeAgo = (lastInteractionTime) => {
    if (!lastInteractionTime) return "No interactions yet";

    const now = new Date();
    const lastInteraction = new Date(lastInteractionTime);
    const diffInMs = now - lastInteraction;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;

    if (hours > 0) {
      return `Interacted ${hours}hr ${minutes}min ago`;
    } else if (minutes > 0) {
      return `Interacted ${minutes}min ago`;
    } else {
      return "Interacted just now";
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Leads</h2>
        <Link to={`/leads/addnew`}>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Add New Lead
          </button>
        </Link>
      </div>

      <ul>
        {leads.map((lead) => (
          <li
            key={lead._id}
            className="p-4 border-b flex justify-between items-center"
          >
            <div>
              <div className="flex flex-row gap-5 items-center">
                <h3 className="text-lg font-bold">{lead.name}</h3>
                {lead.status === "Active" ? (
                  <p className="text-green-500">Active</p>
                ) : lead.status === "Inactive" ? (
                  <p className="text-gray-500">Inactive</p>
                ) : (
                  <p className="text-yellow-600">New</p>
                )}
              </div>
              <p>{lead.address}</p>
              <p>{lead.contactNumber}</p>
            </div>

            <div className="flex space-x-4 items-center">
              <div>
                <p className="text-red-500 font-medium">
                  {formatTimeAgo(lead.lastInteractionTime)}
                </p>
              </div>
              <button
                onClick={() => handleEditLead(lead._id)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                View
              </button>
              <button
                onClick={() => handleDeleteLead(lead._id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leads;
