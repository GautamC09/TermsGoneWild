import React from "react";

const AnalysisResults = ({ data }) => {
  if (!data || data.length === 0) {
    return <p>No analysis results available.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {data.map((item, index) => (
        <div key={index} className="border p-4 rounded-lg shadow-md bg-white">
          <h2 className="text-lg font-semibold text-blue-600">Clause:</h2>
          <p className="text-gray-800">{item.Clause || "N/A"}</p>

          <h2 className="text-lg font-semibold text-red-600 mt-2">Concern:</h2>
          <p className="text-gray-800">{item.Concern || "N/A"}</p>

          <h2 className="text-lg font-semibold text-yellow-600 mt-2">Risk Level:</h2>
          <p className="font-bold">{item["Risk Level"] || "N/A"}</p>

          <h2 className="text-lg font-semibold text-green-600 mt-2">Explanation:</h2>
          <p className="text-gray-800">{item.Explanation || "N/A"}</p>
        </div>
      ))}
    </div>
  );
};

export default AnalysisResults;