import React, { useState, useEffect } from "react";
import { getLeadStats } from "../services/api";

const LeadStats = ({ leadId }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getLeadStats(leadId);
        setStats(data);
      } catch (err) {
        setError("Failed to load statistics.");
        console.error("Error fetching stats:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [leadId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin h-6 w-6 rounded-full border-4 border-blue-500 border-t-transparent"></div>
        <p className="ml-2 text-gray-700">Loading statistics...</p>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="mt-6 p-6 border rounded bg-white shadow-lg">
      <div className="flex flex-col items-center pb-3">
        <h3 className="text-2xl font-bold text-gray-800 text-center">
          Lead Statistics
        </h3>
        <p>Last Interaction</p>
        <p>
          {stats.lastInteractionTime
            ? new Date(stats.lastInteractionTime).toLocaleString()
            : "No interactions yet"}
        </p>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 bg-blue-100 rounded-lg shadow-md text-center">
            <h4 className="text-xl font-semibold text-blue-700">
              Interactions Today
            </h4>
            <p className="text-3xl font-bold text-blue-800">
              {stats.interactionsToday}
            </p>
          </div>
          <div className="p-4 bg-green-100 rounded-lg shadow-md text-center">
            <h4 className="text-xl font-semibold text-green-700">
              Orders Today
            </h4>
            <p className="text-3xl font-bold text-green-800">
              {stats.ordersToday}
            </p>
          </div>
          <div className="p-4 bg-purple-100 rounded-lg shadow-md text-center">
            <h4 className="text-xl font-semibold text-purple-700">
              Pending Orders
            </h4>
            <p className="text-3xl font-bold text-purple-800">
              {stats.pendingOrders}
            </p>
          </div>
          <div className="p-4 bg-yellow-100 rounded-lg shadow-md text-center">
            <h4 className="text-xl font-semibold text-yellow-700">
              Interactions/Day
            </h4>
            <p className="text-3xl font-bold text-yellow-800">
              {stats.averageInteractions}
            </p>
          </div>
          <div className="p-4 bg-red-100 rounded-lg shadow-md text-center">
            <h4 className="text-xl font-semibold text-red-700">Orders/Day</h4>
            <p className="text-3xl font-bold text-red-800">
              {stats.averageCompletedOrders}
            </p>
          </div>
          <div className="p-4 bg-orange-100 rounded-lg shadow-md text-center">
            <h4 className="text-xl font-semibold text-orange-700">
              Cancelled/Day
            </h4>
            <p className="text-3xl font-bold text-orange-800">
              {stats.averageCanceledOrders}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadStats;
