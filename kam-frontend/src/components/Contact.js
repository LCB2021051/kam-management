import React from "react";
import SimulateButton from "./SimulateButton";

const Contact = ({ contact, restaurantId, handleDeleteContact }) => {
  return (
    <li className="p-4 border-b flex justify-between items-center">
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
        <SimulateButton
          restaurantId={restaurantId}
          to={contact.name}
          from="Admin"
          type="Call"
        />
        <SimulateButton
          restaurantId={restaurantId}
          to={contact.name}
          from="Admin"
          type="Email"
        />
        <button
          onClick={() => handleDeleteContact(contact._id)}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </li>
  );
};

export default Contact;