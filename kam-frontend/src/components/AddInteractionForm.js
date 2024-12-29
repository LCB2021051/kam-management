import React, { useState } from "react";

const AddInteractionForm = ({ restaurantId, lead, onInteractionAdded }) => {
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (error) {
    console.error("Error parsing user from localStorage:", error.message);
  }

  const [newInteraction, setNewInteraction] = useState({
    restaurantId,
    type: "Call", // Default value
    about: "",
    from: user?.id || "Admin", // Default to logged-in user or Admin
    to: lead?.leadUser?._id || "", // Default to leadUser's ID
  });
  const [message, setMessage] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false); // Toggle visibility

  const handleAddInteraction = async (e) => {
    e.preventDefault();
    try {
      const { type, about, from, to } = newInteraction;

      // Validate fields
      if (!type || !about || !from || !to) {
        setMessage("All fields are required.");
        return;
      }

      await onInteractionAdded(newInteraction);

      // Reset form and show success message
      setNewInteraction({
        restaurantId,
        type: "Call", // Reset to default
        about: "",
        from: user?.id || "Admin", // Reset to default
        to: lead?.leadUser?._id || "", // Reset to default
      });
      setMessage("Interaction added successfully!");
    } catch (error) {
      setMessage("Failed to add interaction.");
      console.error("Error adding interaction:", error.message);
    }
  };

  const toggleFormVisibility = () => {
    setIsFormVisible((prev) => !prev);
    setMessage(""); // Clear any previous messages
  };

  return (
    <div className="mt-4">
      {/* Toggle Button */}
      <button
        onClick={toggleFormVisibility}
        className={`px-4 py-1 rounded text-white ${
          isFormVisible
            ? "bg-slate-500 hover:bg-slate-600"
            : "bg-green-500 hover:bg-green-600"
        }`}
      >
        {isFormVisible ? "Cancel" : "Add Interaction"}
      </button>

      {/* Form Section */}
      {isFormVisible && (
        <form
          onSubmit={handleAddInteraction}
          className="grid grid-cols-2 gap-2 mt-4"
        >
          <div>
            <label className="block text-xs font-semibold mb-1">Type</label>
            <select
              value={newInteraction.type}
              onChange={(e) =>
                setNewInteraction({
                  ...newInteraction,
                  type: e.target.value,
                })
              }
              className="w-full p-1 border rounded text-xs"
              required
            >
              <option value="Call">Call</option>
              <option value="Email">Email</option>
              <option value="Regular-Update">Regular-Update</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">About</label>
            <input
              type="text"
              value={newInteraction.about}
              onChange={(e) =>
                setNewInteraction({
                  ...newInteraction,
                  about: e.target.value,
                })
              }
              className="w-full p-1 border rounded text-xs"
              placeholder="Purpose"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">From</label>
            <input
              type="text"
              value={newInteraction.from}
              className="w-full p-1 border rounded text-xs bg-gray-100"
              readOnly
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">To</label>
            <input
              type="text"
              value={newInteraction.to}
              onChange={(e) =>
                setNewInteraction({
                  ...newInteraction,
                  to: e.target.value,
                })
              }
              className="w-full p-1 border rounded text-xs"
            />
          </div>

          <div className="col-span-2">
            <button
              type="submit"
              className="w-full bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 text-xs"
            >
              Submit
            </button>
          </div>
        </form>
      )}

      {message && <p className="text-blue-500 mt-2 text-xs">{message}</p>}
    </div>
  );
};

export default AddInteractionForm;
