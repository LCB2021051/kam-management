import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getLeads, deleteLead } from "../services/api"; // Import deleteLead API
import LeadForm from "../components/LeadForm";

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [showForm, setShowForm] = useState(false); // Toggle form visibility
  const navigate = useNavigate();

  // Fetch leads on component mount
  useEffect(() => {
    const fetchLeads = async () => {
      const data = await getLeads();
      setLeads(data);
    };
    fetchLeads();
  }, []);

  const handleLeadAdded = (newLead) => {
    // Add the new lead to the leads list
    setLeads((prevLeads) => [...prevLeads, newLead]);
  };

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
              <button
                onClick={() => handleEditLead(lead._id)}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              >
                Edit
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

      {/* Conditionally Render the LeadForm */}
      {showForm && (
        <div className="mt-6">
          <LeadForm onLeadAdded={handleLeadAdded} />
        </div>
      )}
    </div>
  );
};

export default Leads;
