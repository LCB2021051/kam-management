import React, { useEffect, useState } from "react";
import { getPerformanceMetrics } from "../services/api";
import TopPerformingRestaurants from "../components/TopPerformingRestaurants";
import UnderperformingRestaurants from "../components/UnderperformingRestaurants";
import PerformanceTable from "../components/PerformanceTable";

const PerformanceComparison = () => {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await getPerformanceMetrics(); // Fetch metrics from API
        setMetrics(data.data); // Set metrics from backend (already sorted and enriched)
      } catch (err) {
        setError("Failed to fetch performance metrics.");
        console.error("Error fetching performance metrics:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return <p>Loading performance metrics...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="p-6 rounded-lg">
      <PerformanceTable metrics={metrics} />
      <TopPerformingRestaurants metrics={metrics} />
      <UnderperformingRestaurants metrics={metrics} />
    </div>
  );
};

export default PerformanceComparison;
