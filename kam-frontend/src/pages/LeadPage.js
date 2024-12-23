import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getLeadById,
  addContactToLead,
  deleteContactFromLead,
} from "../services/api";

const LeadPage = () => {
  const { id } = useParams(); // Get the lead ID from the URL
  const [lead, setLead] = useState(null);
  const [newContact, setNewContact] = useState({
    name: "",
    role: "",
    phone: "",
    email: "",
  });

  const navigate = useNavigate();

  // Fetch the lead details on page load
  useEffect(() => {
    const fetchLead = async () => {
      const data = await getLeadById(id);
      setLead(data);
    };
    fetchLead();
  }, [id]);

  const handleAddContact = async (e) => {
    e.preventDefault();
    const updatedLead = await addContactToLead(id, newContact); // Add contact API call
    setLead(updatedLead); // Update lead data with the new contact
    setNewContact({ name: "", role: "", phone: "", email: "" }); // Reset form
  };

  const handleDeleteContact = async (contactId) => {
    const updatedLead = await deleteContactFromLead(id, contactId); // Delete contact API call
    setLead(updatedLead); // Update lead data
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
        <button
          onClick={() => navigate(`/leads/edit/${lead._id}`)}
          className="ml-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Edit Lead
        </button>
      </div>

      {/* Contacts Section */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Contacts</h2>
        <ul>
          {lead.contacts.map((contact) => (
            <li
              key={contact._id}
              className="p-4 border-b flex justify-between items-center"
            >
              <div>
                <p>
                  <span className="font-bold">Name:</span> {contact.name}
                </p>
                <p>
                  <span className="font-bold">Role:</span> {contact.role}
                </p>
                <p>
                  <span className="font-bold">Phone:</span> {contact.phone}
                </p>
                <p>
                  <span className="font-bold">Email:</span> {contact.email}
                </p>
              </div>
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={() => handleDeleteContact(contact._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* Add New Contact Form */}
        <div className="mt-4">
          <h3 className="text-lg font-bold mb-2">Add New Contact</h3>
          <form onSubmit={handleAddContact}>
            <div className="flex flex-col space-y-2">
              <input
                type="text"
                placeholder="Name"
                value={newContact.name}
                onChange={(e) =>
                  setNewContact({ ...newContact, name: e.target.value })
                }
                className="p-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Role"
                value={newContact.role}
                onChange={(e) =>
                  setNewContact({ ...newContact, role: e.target.value })
                }
                className="p-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Phone"
                value={newContact.phone}
                onChange={(e) =>
                  setNewContact({ ...newContact, phone: e.target.value })
                }
                className="p-2 border rounded"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={newContact.email}
                onChange={(e) =>
                  setNewContact({ ...newContact, email: e.target.value })
                }
                className="p-2 border rounded"
                required
              />
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Add Contact
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LeadPage;
