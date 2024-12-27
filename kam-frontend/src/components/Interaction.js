import React, { useState } from "react";
import { getInteractions, addInteraction } from "../services/api";
import NextInteractionDue from "./NextInteractionDue";
import AddInteractionForm from "./AddInteractionForm";

const Interaction = ({ restaurantId, lead }) => {
  const [interactions, setInteractions] = useState([]);
  const [showLog, setShowLog] = useState(false); // Toggle state for interaction log
  const [newInteraction, setNewInteraction] = useState({
    type: "Call", // Default value
    about: "",
    from: "Admin", // Default value
    to: lead?.assignedKAM || "", // Default value
  });
  const [message, setMessage] = useState("");

  // Handle fetching interactions
  const handleGetInteractions = async () => {
    try {
      const data = await getInteractions(restaurantId);
      setInteractions(data);
      setMessage("Interactions fetched successfully!");
    } catch (error) {
      setMessage("Failed to fetch interactions.");
      console.error("Error fetching interactions:", error.message);
    }
  };

  // Handle adding a new interaction
  const handleInteractionAdded = async (restaurantId, interactionData) => {
    const data = await addInteraction(restaurantId, interactionData);
    return data; // API response
  };

  return (
    <div className="p-4">
      {/* Toggle Button */}
      <div className="flex justify-between">
        <button
          onClick={() => {
            if (!showLog) handleGetInteractions(); // Fetch interactions if not already shown
            setShowLog((prev) => !prev); // Toggle visibility
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {showLog ? "Hide Interaction Log" : "Show Interaction Log"}
        </button>
        <NextInteractionDue restaurantId={restaurantId} />
      </div>

      {/* Display Interactions */}
      {showLog && interactions.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-bold mb-4">Interaction Log</h3>
          <ul className="space-y-2">
            {interactions.map((interaction) => (
              <li
                key={interaction._id}
                className="border-b pb-2 pt-2 px-4 flex flex-col sm:flex-row justify-between items-start sm:items-center"
              >
                <div className="flex flex-col sm:flex-row sm:gap-5 sm:items-center">
                  <p className="w-36 truncate font-medium text-gray-800">
                    {interaction.type}
                  </p>
                  <p className="w-36 truncate text-gray-600">
                    {interaction.about}
                  </p>
                  <p className="w-36 truncate text-gray-600">
                    {interaction.from} <span className="font-semibold">to</span>{" "}
                    {interaction.to}
                  </p>
                </div>
                <p className="mt-2 sm:mt-0 text-gray-500 text-sm">
                  {new Date(interaction.time).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>

          {/* Add Interaction Form */}
          <AddInteractionForm
            restaurantId={restaurantId}
            lead={lead}
            onInteractionAdded={handleInteractionAdded}
          />
        </div>
      )}
    </div>
  );
};

export default Interaction;
