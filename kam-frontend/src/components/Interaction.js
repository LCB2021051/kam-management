import React, { useState, useEffect } from "react";
import { getInteractions, addInteraction } from "../services/api";
import NextInteractionDue from "./NextInteractionDue";
import AddInteractionForm from "./AddInteractionForm";

const Interaction = ({ restaurantId, lead }) => {
  const [interactions, setInteractions] = useState([]);
  const [showLog, setShowLog] = useState(false); // Toggle state for interaction log
  const [message, setMessage] = useState("");

  // Fetch interactions when `showLog` is toggled to true
  useEffect(() => {
    if (showLog) {
      fetchInteractions();
    }
  }, [showLog, lead]);

  const fetchInteractions = async () => {
    try {
      const { interactions } = await getInteractions(restaurantId);
      setInteractions(interactions);
      setMessage("Interactions fetched successfully!");
    } catch (error) {
      setMessage("Failed to fetch interactions.");
      console.error("Error fetching interactions:", error.message);
    }
  };

  const handleInteractionAdded = async (interactionData) => {
    try {
      const { interaction } = await addInteraction(interactionData);
      setInteractions((prevInteractions) => [interaction, ...prevInteractions]);
      setMessage("Interaction added successfully!");
    } catch (error) {
      setMessage("Failed to add interaction.");
      console.error("Error adding interaction:", error.message);
    }
  };

  return (
    <div className="p-4">
      {/* Toggle Button */}
      <div className="flex justify-between">
        <button
          onClick={() => setShowLog((prev) => !prev)} // Toggle visibility
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {showLog ? "Hide Interaction Log" : "Show Interaction Log"}
        </button>
        <NextInteractionDue restaurantId={restaurantId} />
      </div>

      {/* Display Interactions */}
      {showLog && (
        <div className="mt-4">
          <h3 className="text-lg font-bold mb-4">Interaction Log</h3>
          {interactions.length > 0 ? (
            <ul className="space-y-2">
              {interactions.map((interaction) => (
                <li
                  key={interaction.id}
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
                      {interaction.from?.name}{" "}
                      <span className="font-semibold">to</span>{" "}
                      {interaction.to?.name}
                    </p>
                  </div>
                  <p className="mt-2 sm:mt-0 text-gray-500 text-sm">
                    {new Date(interaction.time).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No interactions found.</p>
          )}

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
