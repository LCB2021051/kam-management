import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getLeads, deleteLead } from "../services/api";

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const navigate = useNavigate();

  // Fetch leads on component mount
  useEffect(() => {
    const fetchLeads = async () => {
      const data = await getLeads();
      setLeads(data);
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

  const formatTimeAgo = (lastCallTime) => {
    if (!lastCallTime) return "No calls yet";

    const now = new Date();
    const lastCall = new Date(lastCallTime);
    const diffInMs = now - lastCall;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;

    if (hours > 0) {
      return `Called ${hours}hr ${minutes}min ago`;
    } else if (minutes > 0) {
      return `Called ${minutes}min ago`;
    } else {
      return "Called just now";
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
              <h3 className="text-lg font-bold">{lead.name}</h3>
              <p>{lead.address}</p>
              <p>{lead.contactNumber}</p>
            </div>
            <div className="flex space-x-2">
              <div>
                <p className="text-red-500 font-medium mr-5">
                  {formatTimeAgo(lead.lastCallTime)}
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
