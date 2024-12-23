import React, { useEffect, useState } from "react";
import {
  getLeads,
  deleteLead,
  createLead,
  addContactToLead,
  deleteContactFromLead,
} from "../services/api";
import LeadForm from "../components/LeadForm";
import ContactForm from "../components/ContactForm";
import EditLeadForm from "../components/EditLeadForm";

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [editingLead, setEditingLead] = useState(null);

  // Fetch leads from backend
  useEffect(() => {
    const fetchLeads = async () => {
      const data = await getLeads();
      setLeads(data);
    };
    fetchLeads();
  }, []);

  // Add a new lead
  const handleAddLead = async (newLead) => {
    setLeads([...leads, newLead]); // Add new lead to state
  };

  // Delete a lead
  const handleDeleteLead = async (id) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      await deleteLead(id);
      setLeads(leads.filter((lead) => lead._id !== id));
    }
  };

  // Add a contact to a lead
  const handleAddContact = async (leadId, contactData) => {
    const updatedLead = contactData;

    setLeads((prevLeads) => {
      const newLeads = prevLeads.map((lead) =>
        lead._id === leadId ? updatedLead : lead
      );
      return newLeads;
    });
  };

  // Delete a contact from a lead
  const handleDeleteContact = async (leadId, contactId) => {
    const updatedLead = await deleteContactFromLead(leadId, contactId);
    setLeads(leads.map((lead) => (lead._id === leadId ? updatedLead : lead))); // Update the lead in state
  };

  // Complete editing a lead
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
      {/* Add New Lead Form */}
      <LeadForm onLeadAdded={handleAddLead} />

      <ul className="mt-6">
        {leads.map((lead) => (
          <li key={lead._id} className="p-4 border-b">
            {/* Edit Lead Form */}
            {editingLead && editingLead._id === lead._id ? (
              <EditLeadForm
                lead={lead}
                onUpdateComplete={handleUpdateComplete}
                onCancel={() => setEditingLead(null)}
              />
            ) : (
              <>
                <h3 className="text-lg font-bold">{lead.name}</h3>
                <p>{lead.address}</p>
                <p>{lead.contactNumber}</p>
                <p>Status: {lead.status}</p>
                <div className="flex space-x-4 mt-2">
                  <button
                    onClick={() => setEditingLead(lead)}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteLead(lead._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}

            {/* Contacts Section */}
            <div className="mt-4">
              <h4 className="text-md font-bold">Contacts</h4>
              <ul>
                {lead.contacts.map((contact) => (
                  <li
                    key={contact._id}
                    className="p-2 border-b flex justify-between items-center"
                  >
                    <div>
                      <p>
                        {contact.name} ({contact.role})
                      </p>
                      <p>{contact.phone}</p>
                      <p>{contact.email}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteContact(lead._id, contact._id)}
                      className="bg-red-500 text-white px-4 py-1 rounded"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
              {/* Add New Contact Form */}
              <ContactForm
                leadId={lead._id}
                onContactAdded={(leadId, contactData) =>
                  handleAddContact(leadId, contactData)
                }
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leads;
