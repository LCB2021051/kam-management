import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getLeads } from "../services/api";

const SearchPage = () => {
  const location = useLocation();
  const [filters, setFilters] = useState({
    name: location.state?.name || "",
    status: location.state?.status || "",
    assignedKAM: "",
  });
  const [results, setResults] = useState([]);

  // Fetch and filter leads
  useEffect(() => {
    const fetchLeads = async () => {
      const allLeads = await getLeads();
      const filteredLeads = allLeads.filter((lead) =>
        Object.entries(filters).every(([key, value]) =>
          value ? lead[key]?.toLowerCase().includes(value.toLowerCase()) : true
        )
      );
      setResults(filteredLeads);
    };
    fetchLeads();
  }, [filters]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
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
        </form>
      </div>

      {/* Results Section */}
      <div className="w-2/3 p-4">
        <h3 className="text-lg font-bold mb-4">Search Results</h3>
        {results.length > 0 ? (
          <ul>
            {results.map((lead) => (
              <li key={lead._id} className="p-4 border-b">
                <h4 className="font-bold">{lead.name}</h4>
                <p>Status: {lead.status}</p>
                <p>Assigned KAM: {lead.assignedKAM}</p>
                <p>Contact: {lead.contactNumber}</p>
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
