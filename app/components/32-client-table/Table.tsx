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
      <h2 className="text-3xl font-bold text-[var(--foreground)] mb-6">Clients</h2>
      <div className="flex items-center mb-6 space-x-4">
        <input
          type="text"
          placeholder="Filter by client name..."
          className="input bg-muted text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          value={clientNameFilter}
          onChange={(e) => setClientNameFilter(e.target.value)}
        />
        <select
          className="input bg-muted text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Completed">Completed</option>
          <option value="In Progress">In Progress</option>
        </select>
      </div>
      <div className="glass overflow-x-auto overflow-y-auto max-h-[500px] rounded-lg shadow-[var(--shadow-lg)]">
        <table className="table-fixed w-[800px]">
          <thead className="bg-muted text-[var(--foreground)]">
            <tr>
              <th className="p-4 text-left w-[200px]">Client</th>
              <th className="p-4 text-left w-[200px]">Project</th>
              <th className="p-4 text-left w-[100px]">Status</th>
              <th className="p-4 text-left w-[150px]">Progress</th>
              <th className="p-4 text-left w-[150px]">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr key={index} className="border-b border-[var(--border)] hover:bg-muted">
                  <td className="p-4 flex items-center w-[200px]">
                    <img
                      src={item.image}
                      alt={item.client}
                      className="w-10 h-10 rounded-full mr-4"
                    />
                    <div>
                      <div className="font-bold text-[var(--foreground)]">{item.client}</div>
                      <div className="text-sm text-[var(--muted-foreground)]">{item.country}</div>
                    </div>
                  </td>
                  <td className="p-4 text-[var(--foreground)] w-[200px]">{item.project}</td>
                  <td className="p-4 w-[100px]">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        item.status === "Completed"
                          ? "bg-green-500 text-green-400"
                          : "bg-yellow-500 text-yellow-400"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 w-[150px]">
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div
                        className="bg-blue-500 h-2.5 rounded-full"
                        style={{ width: item.progress }}
                      ></div>
                    </div>
                  </td>
                  <td className="p-4 text-[var(--muted-foreground)] w-[150px]">{item.date}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-8 text-[var(--muted-foreground)]">
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
