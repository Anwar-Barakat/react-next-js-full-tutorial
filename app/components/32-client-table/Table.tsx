'use client';
import React, { useState } from "react";
import { data } from "./data";

const Table = () => {
  const [clientNameFilter, setClientNameFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredData = data.filter((item) => {
    const nameMatch = item.client
      .toLowerCase()
      .includes(clientNameFilter.toLowerCase());
    const statusMatch =
      statusFilter === "All" || item.status === statusFilter;
    return nameMatch && statusMatch;
  });

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-white mb-6">Clients</h2>
      <div className="flex items-center mb-6 space-x-4">
        <input
          type="text"
          placeholder="Filter by client name..."
          className="px-4 py-2 rounded-lg bg-[var(--muted)]/30 text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          value={clientNameFilter}
          onChange={(e) => setClientNameFilter(e.target.value)}
        />
        <select
          className="px-4 py-2 rounded-lg bg-[var(--muted)]/30 text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Completed">Completed</option>
          <option value="In Progress">In Progress</option>
        </select>
      </div>
      <div className="overflow-x-auto rounded-lg shadow-[var(--shadow-lg)]">
        <table className="w-full table-auto">
          <thead className="bg-[var(--muted)]/30 text-white">
            <tr>
              <th className="p-4 text-left">Client</th>
              <th className="p-4 text-left">Project</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Progress</th>
              <th className="p-4 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr key={index} className="border-b border-[var(--border)] hover:bg-[var(--muted)]/10">
                  <td className="p-4 flex items-center">
                    <img
                      src={item.image}
                      alt={item.client}
                      className="w-10 h-10 rounded-full mr-4"
                    />
                    <div>
                      <div className="font-bold text-white">{item.client}</div>
                      <div className="text-sm text-gray-400">{item.country}</div>
                    </div>
                  </td>
                  <td className="p-4 text-white">{item.project}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        item.status === "Completed"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                      <div
                        className="bg-blue-500 h-2.5 rounded-full"
                        style={{ width: item.progress }}
                      ></div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-400">{item.date}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-400">
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
