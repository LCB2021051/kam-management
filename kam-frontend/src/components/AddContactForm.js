import React, { useState } from "react";

const AddContactForm = ({ onAddContact }) => {
  const [newContact, setNewContact] = useState({
    name: "",
    role: "",
    phone: "",
    email: "",
  });
  const [isVisible, setIsVisible] = useState(false); // State to toggle visibility

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddContact(newContact);
    setNewContact({ name: "", role: "", phone: "", email: "" }); // Reset form
  };

  const toggleFormVisibility = () => {
    setIsVisible((prev) => !prev);
  };

  return (
    <div className="mt-4">
      {/* Toggle Button */}
      <button
        onClick={toggleFormVisibility}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {isVisible ? "Cancle Add Contact" : "Add New Contact"}
      </button>

      {/* Conditionally Render Form */}
      {isVisible && (
        <div className="mt-4">
          <h3 className="text-lg font-bold mb-2">Add New Contact</h3>
          <form onSubmit={handleSubmit}>
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
      )}
    </div>
  );
};

export default AddContactForm;
