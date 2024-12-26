import React from "react";
import { addInteraction } from "../services/api";

const handleSimulate = async (restaurantId, to, from, type) => {
  try {
    const about = prompt(
      `Enter ${type} purpose (e.g., Discussing monthly sales):`
    );
    if (!to || !from || !about) {
      alert("All fields (To, From, About) are required.");
      return;
    }
    const newInteraction = {
      type,
      about,
      from,
      to,
    };

    const res = await addInteraction(restaurantId, newInteraction);

    alert(`${type} interaction added successfully!`);
  } catch (error) {
    console.error("Error adding call interaction:", error.message);
    alert(`Failed to add ${type} interaction.`);
  }
};

const SimulateButton = ({ restaurantId, to, from, type }) => {
  return (
    <button
      onClick={() => handleSimulate(restaurantId, to, from, type)}
      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
    >
      Simulate {type}
    </button>
  );
};

export default SimulateButton;
