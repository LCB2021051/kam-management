import React, { useEffect, useState } from "react";
import { getDashboardStats } from "../services/api";

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      const data = await getDashboardStats();
      setStats(data);
    };
    fetchStats();
  }, []);

  if (!stats) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-100 rounded">
          <h3 className="text-lg font-bold">Total Leads</h3>
          <p className="text-2xl">{stats.totalLeads}</p>
        </div>
        <div className="p-4 bg-green-100 rounded">
          <h3 className="text-lg font-bold">Active Leads</h3>
          <p className="text-2xl">{stats.activeLeads}</p>
        </div>
        <div className="p-4 bg-yellow-100 rounded">
          <h3 className="text-lg font-bold">New Leads</h3>
          <p className="text-2xl">{stats.newLeads}</p>
        </div>
        <div className="p-4 bg-red-100 rounded">
          <h3 className="text-lg font-bold">Inactive Leads</h3>
          <p className="text-2xl">{stats.inactiveLeads}</p>
        </div>
      </div>
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Recent Leads</h3>
        <ul>
          {stats.recentLeads.map((lead) => (
            <li key={lead._id} className="p-2 border-b">
              <p className="font-bold">{lead.name}</p>
              <p>{lead.address}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
