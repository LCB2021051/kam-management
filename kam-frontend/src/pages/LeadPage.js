import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getLeadById,
  addContactToLead,
  deleteContactFromLead,
} from "../services/api";
import LeadStats from "../components/LeadStats";
import Interaction from "../components/Interaction";
import Contact from "../components/Contact";
import AddContactForm from "../components/AddContactForm";
import SimulateButton from "../components/SimulateButton";

const LeadPage = () => {
  const { id } = useParams();
  const [lead, setLead] = useState(null);

  const [callMessage, setCallMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLead = async () => {
      const data = await getLeadById(id);
      setLead(data);
    };
    fetchLead();
  }, [id]);

  const handleAddContact = async (contact) => {
    const updatedLead = await addContactToLead(id, contact);
    setLead(updatedLead);
  };

  const handleDeleteContact = async (contactId) => {
    const updatedLead = await deleteContactFromLead(id, contactId);
    setLead(updatedLead);
  };

  if (!lead) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-4">
      {/* Lead Information */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">{lead.name}</h1>
          <p>
            <span className="font-bold">Address:</span> {lead.address}
          </p>
          <p>
            <span className="font-bold">Contact Number:</span>{" "}
            {lead.contactNumber}
          </p>
          <p>
            <span className="font-bold">Status:</span> {lead.status}
          </p>
          <p>
            <span className="font-bold">Assigned KAM:</span> {lead.assignedKAM}
          </p>
        </div>
        <div className="flex flex-col gap-2 p-3">
          <button
            onClick={() => navigate(`/leads/edit/${lead._id}`)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Edit Lead
          </button>
          <SimulateButton
            restaurantId={id}
            to={lead.assignedKAM}
            from="Admin"
            type="Call"
          />
          <SimulateButton
            restaurantId={id}
            to={lead.assignedKAM}
            from="Admin"
            type="Email"
          />
        </div>
      </div>

      {/* Lead Statistics */}
      <LeadStats leadId={id} />

      {/* Interaction */}
      <Interaction restaurantId={id} lead={lead} />

      {/* Contacts Section */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4 text-green-600">Contacts</h2>
        <ul>
          {lead.contacts.map((contact) => (
            <Contact
              key={contact._id}
              contact={contact}
              restaurantId={id}
              handleDeleteContact={handleDeleteContact}
            />
          ))}
        </ul>

        {/* Add New Contact Form */}
        <AddContactForm onAddContact={handleAddContact} />
      </div>
    </div>
  );
};

export default LeadPage;
