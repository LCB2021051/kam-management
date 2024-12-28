import React from "react";
import { addInteraction } from "../services/api";

const SimulateButton = ({ restaurantId, to, from, type }) => {
  const handleSimulate = async () => {
    try {
      const about = prompt(
        `Enter ${type} purpose (e.g., Discussing monthly sales):`
      );

      if (!about) {
        alert("Purpose of interaction (about) is required.");
        return;
      }

      if (!restaurantId || !to || !from) {
        alert("Restaurant ID, To, and From fields are required.");
        return;
      }

      const interactionData = { restaurantId, type, from, to, about };
      await addInteraction(interactionData);

      alert(`${type} interaction added successfully!`);
    } catch (error) {
      console.error(`Error adding ${type} interaction:`, error.message);
      alert(`Failed to add ${type} interaction.`);
    }
  };

  return (
    <button
      onClick={handleSimulate}
      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
    >
      Simulate {type}
    </button>
  );
};

export default SimulateButton;
