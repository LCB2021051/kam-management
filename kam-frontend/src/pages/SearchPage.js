import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { getLeads } from "../services/api";

const SearchPage = () => {
  const location = useLocation();
  const [filters, setFilters] = useState({
    name: location.state?.name || "",
    status: location.state?.status || "",
    assignedKAM: "",
  });
  const [results, setResults] = useState([]);
  const [sortBy, setSortBy] = useState("");

  // Fetch and filter leads
  useEffect(() => {
    const fetchLeads = async () => {
      const allLeads = await getLeads();

      // Apply filters
      const filteredLeads = allLeads.filter((lead) =>
        Object.entries(filters).every(([key, value]) => {
          if (!value) return true;
          if (key === "status") {
            return lead[key] === value;
          }
          return lead[key]?.toLowerCase().includes(value.toLowerCase());
        })
      );

      // Apply sorting
      const sortedLeads = [...filteredLeads].sort((a, b) => {
        if (sortBy === "averageInteractions") {
          return (b.averageInteractions || 0) - (a.averageInteractions || 0);
        } else if (sortBy === "averageOrders") {
          return (b.averageOrders || 0) - (a.averageOrders || 0);
        } else if (sortBy === "lastInteractionTime") {
          return (
            new Date(b.lastInteractionTime) - new Date(a.lastInteractionTime)
          );
        }
        return 0;
      });

      setResults(sortedLeads);
    };

    fetchLeads();
  }, [filters, sortBy]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // Handle sorting option change
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  return (
    <div className="flex">
      {/* Search Form */}
      <div className="w-1/3 p-4 border-r">
        <h3 className="text-lg font-bold mb-4">Search Filters</h3>
        <form>
          <div className="mb-4">
            <label className="block mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={filters.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Search by name"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="">All</option>
              <option value="Active">Active</option>
              <option value="New">New</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-1">Assigned KAM</label>
            <input
              type="text"
              name="assignedKAM"
              value={filters.assignedKAM}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Search by KAM"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Default (No Sorting)</option>
              <option value="averageInteractions">Average Interactions</option>
              <option value="averageOrders">Average Orders</option>
              <option value="lastInteractionTime">Last Interaction Time</option>
            </select>
          </div>
        </form>
      </div>

      {/* Results Section */}
      <div className="w-2/3 p-4">
        <h3 className="text-lg font-bold mb-4">Search Results</h3>
        {results.length > 0 ? (
          <ul>
            {results.map((lead) => (
              <li key={lead._id} className="p-4 border-b">
                <Link
                  to={`/leads/${lead._id}`}
                  className="flex justify-between"
                >
                  <div>
                    <div className="flex flex-row gap-3">
                      <h4 className="font-bold">{lead.name}</h4>
                      {lead.status === "Active" ? (
                        <p className="text-green-500">Active</p>
                      ) : (
                        <p className="text-gray-500">Inactive</p>
                      )}
                    </div>
                    <p>Assigned KAM: {lead.assignedKAM}</p>
                    <p>Contact: {lead.contactNumber}</p>
                  </div>
                  <div>
                    <p>Average Interactions: {lead.averageInteractions || 0}</p>
                    <p>Average Orders: {lead.averageOrders || 0}</p>
                    <p>
                      Last Interaction:{" "}
                      {lead.lastInteractionTime
                        ? new Date(lead.lastInteractionTime).toLocaleString()
                        : "No interactions yet"}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No leads found matching the criteria.</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
