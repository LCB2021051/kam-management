import React, { useEffect, useState } from "react";
import { getLeads, deleteLead } from "../services/api";
import LeadForm from "../components/LeadForm";
import EditLeadForm from "../components/EditLeadForm";

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [editingLead, setEditingLead] = useState(null);

  useEffect(() => {
    const fetchLeads = async () => {
      const data = await getLeads();
      setLeads(data);
    };
    fetchLeads();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      await deleteLead(id);
      setLeads(leads.filter((lead) => lead._id !== id));
    }
  };

  const handleLeadAdded = (newLead) => {
    setLeads([...leads, newLead]);
  };

  const handleUpdateComplete = () => {
    setEditingLead(null);
    const fetchLeads = async () => {
      const data = await getLeads();
      setLeads(data);
    };
    fetchLeads();
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Leads</h2>
      {editingLead ? (
        <EditLeadForm
          lead={editingLead}
          onUpdateComplete={handleUpdateComplete}
          onCancel={() => setEditingLead(null)}
        />
      ) : (
        <LeadForm onLeadAdded={handleLeadAdded} />
      )}
      <ul className="mt-4">
        {leads.map((lead) => (
          <li
            key={lead._id}
            className="flex justify-between items-center p-2 border-b"
          >
            <div>
              <p className="font-bold">{lead.name}</p>
              <p>{lead.address}</p>
              <p>{lead.contactNumber}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setEditingLead(lead)}
                className="bg-green-500 text-white px-4 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(lead._id)}
                className="bg-red-500 text-white px-4 py-1 rounded"
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
