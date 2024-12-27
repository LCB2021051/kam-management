import React, { useState, useEffect } from "react";
import { getLeadsForInteraction } from "../services/api";
import { Link } from "react-router-dom";

const InteractionNotifications = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeadsForInteraction = async () => {
      try {
        setLoading(true);
        const response = await getLeadsForInteraction();

        setLeads(response.data);
      } catch (err) {
        setError("Failed to fetch due interactions.");
        console.error("Error fetching notifications:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeadsForInteraction();
  }, []);

  if (loading) {
    return <p>Loading notifications...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="mt-8">
      {leads.length > 0 ? (
        <h2 className="text-red-500 text-xl font-bold mb-4">
          Interactions Due Today
        </h2>
      ) : (
        <h2 className="text-green-500 text-xl font-bold mb-4">
          No Interactions Due Today
        </h2>
      )}

      {leads.length > 0 && (
        <ul className="flex flex-row gap-5">
          {leads.map((lead) => (
            <li key={lead.id} className="border-b rounded-md p-2 bg-yellow-400">
              <Link to={`/leads/${lead.id}`}>
                <p className="font-bold">{lead.name}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default InteractionNotifications;
