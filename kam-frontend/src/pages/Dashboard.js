import React, { useEffect, useState } from "react";
import { getDashboardStats } from "../services/api";
import { useNavigate } from "react-router-dom";
import InteractionNotifications from "../components/InteractionNotifications";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
        setError("");
      } catch (err) {
        setError("Failed to fetch dashboard stats.");
        console.error("Error fetching dashboard stats:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleSearchRedirect = (status) => {
    navigate("/search", { state: { status } });
  };

  const formatDateTime = (dateTime) => {
    return dateTime
      ? new Date(dateTime).toLocaleString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      : "No interactions yet";
  };

  const StatCard = ({ label, value, bgColor, onClick }) => (
    <div className={`p-4 rounded cursor-pointer ${bgColor}`} onClick={onClick}>
      <h3 className="text-lg font-bold">{label}</h3>
      <p className="text-2xl">{value}</p>
    </div>
  );

  if (loading) {
    return <p>Loading dashboard stats...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard
          label="Total Leads"
          value={stats.totalLeads}
          bgColor="bg-blue-100"
          onClick={() => handleSearchRedirect("")}
        />
        <StatCard
          label="Active Leads"
          value={stats.activeLeads}
          bgColor="bg-green-100"
          onClick={() => handleSearchRedirect("Active")}
        />
        <StatCard
          label="New Leads"
          value={stats.newLeads}
          bgColor="bg-yellow-100"
          onClick={() => handleSearchRedirect("New")}
        />
        <StatCard
          label="Inactive Leads"
          value={stats.inactiveLeads}
          bgColor="bg-red-100"
          onClick={() => handleSearchRedirect("Inactive")}
        />
      </div>

      <InteractionNotifications />

      {/* Recent Leads */}
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Recent Leads</h3>
        <ul>
          {stats.recentLeads.map((lead) => (
            <li
              key={lead._id}
              className="p-2 border-b flex justify-between items-center cursor-pointer"
              onClick={() => navigate(`/leads/${lead._id}`)}
            >
              <div>
                <p className="font-bold">{lead.name}</p>
                <p>{lead.address}</p>
              </div>
              <div className="flex flex-row gap-5">
                <div>
                  {lead.status === "Active" ? (
                    <p className="text-green-500">Active</p>
                  ) : lead.status === "Inactive" ? (
                    <p className="text-gray-500">Inactive</p>
                  ) : (
                    <p className="text-yellow-600">New</p>
                  )}
                </div>
                <div className="text-gray-500 text-sm">
                  {formatDateTime(lead.lastInteractionTime)}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
