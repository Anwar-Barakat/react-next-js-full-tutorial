import React from "react";
import Sidebar from '../Sidebar';
import Table from '../Table';

const Dashboard = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 glass p-8">
        <Table />
      </div>
    </div>
  );
};

export default Dashboard;
