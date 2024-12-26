import React, { useState } from "react";
import { getInteractions, addInteraction } from "../services/api";

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
  const handleAddInteraction = async (e) => {
    e.preventDefault();
    try {
      const { type, about, from, to } = newInteraction;

      // Validate fields
      if (!type || !about || !from || !to) {
        setMessage("All fields are required.");
        return;
      }

      const data = await addInteraction(restaurantId, newInteraction);

      setInteractions((prev) => [data, ...prev]); // Add new interaction to the list
      setNewInteraction({
        type: "Call", // Reset to default
        about: "",
        from: "Admin", // Reset to default
        to: lead?.assignedKAM || "", // Reset to default
      });
      setMessage("Interaction added successfully!");
    } catch (error) {
      setMessage("Failed to add interaction.");
      console.error("Error adding interaction:", error.message);
    }
  };

  return (
    <div className="p-4">
      {/* Toggle Button */}
      <button
        onClick={() => {
          if (!showLog) handleGetInteractions(); // Fetch interactions if not already shown
          setShowLog((prev) => !prev); // Toggle visibility
        }}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {showLog ? "Hide Interaction Log" : "Show Interaction Log"}
      </button>

      {/* Display Interactions */}
      {showLog && interactions.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-bold mb-4">Interaction Log</h3>
          <ul>
            {interactions.map((interaction) => (
              <li key={interaction._id} className="border-b p-2">
                <div className="flex flex-row justify-between">
                  <div className="flex flex-row gap-5">
                    <p className="w-36 truncate">{interaction.type}</p>
                    <p className="w-36 truncate">{interaction.about}</p>
                    <p className="w-36 truncate">
                      {interaction.from}
                      {" to "}
                      {interaction.to}
                    </p>
                  </div>
                  <p>{new Date(interaction.time).toLocaleString()}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Add New Interaction */}
      <form onSubmit={handleAddInteraction} className="mt-4">
        <h3 className="text-lg font-bold mb-4">Add Custom Interaction</h3>
        <div className="grid grid-cols-2 gap-2">
          {/* Interaction Type Dropdown */}
          <div>
            <label className="block text-sm font-semibold mb-1">Type</label>
            <select
              value={newInteraction.type}
              onChange={(e) =>
                setNewInteraction({ ...newInteraction, type: e.target.value })
              }
              className="w-full p-1 border rounded text-sm"
              required
            >
              <option value="Call">Call</option>
              <option value="Email">Email</option>
            </select>
          </div>

          {/* About Input */}
          <div>
            <label className="block text-sm font-semibold mb-1">About</label>
            <input
              type="text"
              value={newInteraction.about}
              onChange={(e) =>
                setNewInteraction({ ...newInteraction, about: e.target.value })
              }
              className="w-full p-1 border rounded text-sm"
              placeholder="Purpose (e.g., Sales)"
              required
            />
          </div>

          {/* From Input (Default: Admin) */}
          <div>
            <label className="block text-sm font-semibold mb-1">From</label>
            <input
              type="text"
              value={newInteraction.from}
              onChange={(e) =>
                setNewInteraction({ ...newInteraction, from: e.target.value })
              }
              className="w-full p-1 border rounded text-sm"
              readOnly
            />
          </div>

          {/* To Input (Default: Assigned KAM) */}
          <div>
            <label className="block text-sm font-semibold mb-1">To</label>
            <input
              type="text"
              value={newInteraction.to}
              onChange={(e) =>
                setNewInteraction({ ...newInteraction, to: e.target.value })
              }
              className="w-full p-1 border rounded text-sm"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 mt-2 text-sm"
        >
          Add Interaction
        </button>
      </form>
    </div>
  );
};

export default Interaction;
