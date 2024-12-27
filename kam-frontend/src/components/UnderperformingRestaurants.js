import React from "react";

const UnderperformingRestaurants = ({ metrics }) => {
  // Filter underperforming restaurants
  const underperforming = metrics.filter(
    (metric) => metric.performanceIndex < 33
  );

  return (
    <div className="p-6 rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-red-600">
        Underperforming Restaurants
      </h2>
      {underperforming.length === 0 ? (
        <p>No underperforming restaurants found.</p>
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
              {underperforming.map((metric, index) => (
                <tr
                  key={metric.id}
                  className={`${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  } hover:bg-red-100 transition duration-150`}
                >
                  <td className="px-4 py-3 text-gray-800">{metric.name}</td>
                  <td className="px-4 py-3 text-center font-semibold text-red-600">
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

export default UnderperformingRestaurants;
