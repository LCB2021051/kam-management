import React from "react";

const PerformanceTable = ({ metrics }) => {
  return (
    <div className="p-6 rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Performance Comparison
      </h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full text-left border-collapse bg-white rounded-lg overflow-hidden shadow-lg">
          <thead className="text-slate-600 text-center">
            <tr>
              <th className="px-4 py-3 font-semibold">Restaurant</th>
              <th className="px-4 py-3 font-semibold">Average Orders</th>
              <th className="px-4 py-3 font-semibold">Average Canceled</th>
              <th className="px-4 py-3 font-semibold">Average Interactions</th>
              <th className="px-4 py-3 font-semibold">Weighted Score</th>
              <th className="px-4 py-3 font-semibold">Performance Index (%)</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((metric, index) => (
              <tr
                key={metric.id}
                className={`${
                  index % 2 === 0 ? "bg-gray-100" : "bg-white"
                } hover:bg-blue-100 transition duration-150`}
              >
                <td className="px-4 py-3 text-gray-800">{metric.name}</td>
                <td className="px-4 py-3 text-center text-green-600 font-semibold">
                  {metric.averageCompletedOrders}
                </td>
                <td className="px-4 py-3 text-center text-red-600 font-semibold">
                  {metric.averageCanceledOrders}
                </td>
                <td className="px-4 py-3 text-center text-blue-600 font-semibold">
                  {metric.averageInteractions}
                </td>
                <td className="px-4 py-3 text-center font-semibold text-purple-600">
                  {metric.weightedScore.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-center font-semibold text-yellow-600">
                  {metric.performanceIndex}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PerformanceTable;
