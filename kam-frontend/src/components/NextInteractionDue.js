import React, { useState, useEffect } from "react";
import { getNextInteractionDue } from "../services/api"; // API function to fetch the next due date

const NextInteractionDue = ({ restaurantId }) => {
  const [nextDueDate, setNextDueDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNextInteractionDue = async () => {
      try {
        setLoading(true);
        const response = await getNextInteractionDue(restaurantId);

        // Convert the fetched date to a Date object and format it in local timezone
        const rawDate = response.data.nextInteractionDue;
        const localFormattedDate = rawDate
          ? new Date(rawDate).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
          : null;

        setNextDueDate(localFormattedDate);
      } catch (err) {
        console.error("Error fetching next interaction due:", err.message);
        setError("Failed to fetch next interaction due date.");
      } finally {
        setLoading(false);
      }
    };

    fetchNextInteractionDue();
  }, [restaurantId]);

  if (loading) {
    return <p className="text-gray-500">Loading next interaction due...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="flex flex-col-2 gap-5 items-center">
      <h3 className="font-bold items-center">Next Interaction Due</h3>
      <p className="text-blue-600 items-center">
        {nextDueDate || "No interaction schedule available"}
      </p>
    </div>
  );
};

export default NextInteractionDue;
