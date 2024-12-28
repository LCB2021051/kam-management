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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchLead();
  }, [id]);

  const fetchLead = async () => {
    try {
      const data = await getLeadById(id);
      setLead(data);
      setError("");
    } catch (err) {
      console.error("Error fetching lead:", err.message);
      setError("Failed to load lead details.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddContact = async (contact) => {
    try {
      const updatedLead = await addContactToLead(id, contact);
      setLead(updatedLead);
      fetchLead();
    } catch (err) {
      console.error("Error adding contact:", err.message);
    }
  };

  const handleDeleteContact = async (contactId) => {
    try {
      const updatedLead = await deleteContactFromLead(id, contactId);
      setLead(updatedLead);
      fetchLead();
    } catch (err) {
      console.error("Error deleting contact:", err.message);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
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
            <span className="font-bold">Status:</span> {lead.status}
          </p>
          <p>
            <span className="font-bold">Last Login:</span>{" "}
            {lead.lastLoginTime
              ? new Date(lead.lastLoginTime).toLocaleString("en-GB")
              : "No login yet"}
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
            to={lead.leadUser}
            from={user.id}
            type="Regular-Update"
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
          {Array.isArray(lead.contacts) && lead.contacts.length > 0 ? (
            lead.contacts.map((contact) => (
              <Contact
                key={contact._id}
                contact={contact}
                restaurantId={id}
                handleDeleteContact={handleDeleteContact}
              />
            ))
          ) : (
            <p className="text-gray-500">No contacts available.</p>
          )}
        </ul>

        {/* Add New Contact Form */}
        <AddContactForm onAddContact={handleAddContact} />
      </div>
    </div>
  );
};

export default LeadPage;
