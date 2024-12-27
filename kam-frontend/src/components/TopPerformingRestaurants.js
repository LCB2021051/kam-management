import React from "react";

const TopPerformingRestaurants = ({ metrics }) => {
  // Filter top-performing restaurants
  const topPerforming = metrics.filter(
    (metric) => metric.performanceIndex > 66
  );

  return (
    <div className="p-6 rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-green-600">
        Top Performing Restaurants
      </h2>
      {topPerforming.length === 0 ? (
        <p>No top-performing restaurants found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full text-left border-collapse bg-white rounded-lg overflow-hidden shadow-lg">
            <thead className="text-slate-600 text-center">
              <tr>
                <th className="px-4 py-3 font-semibold">Restaurant</th>
                <th className="px-4 py-3 font-semibold">
                  Performance Index (%)
                </th>
              </tr>
            </thead>
            <tbody>
              {topPerforming.map((metric, index) => (
                <tr
                  key={metric.id}
                  className={`${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  } hover:bg-green-100 transition duration-150`}
                >
                  <td className="px-4 py-3 text-gray-800">{metric.name}</td>
                  <td className="px-4 py-3 text-center font-semibold text-green-600">
                    {metric.performanceIndex}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TopPerformingRestaurants;
