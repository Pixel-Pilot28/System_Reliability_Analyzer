import React from "react";
import Button from "@mui/material/Button";

interface DashboardProps {
  systemErrorRate: number;
  onViewGraph: () => void;
  onEditNodes: () => void;
  onViewRiskReport: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ systemErrorRate, onViewGraph, onEditNodes, onViewRiskReport }) => {
  return (
    <div className="p-6">
      <h1>Dashboard</h1>
      <p>System Error Rate: {systemErrorRate}%</p>
      <div className="mt-4 space-y-2">
        <Button variant="contained" color="primary" onClick={onViewGraph}>
          View Process Gap Visualization
        </Button>
        <Button variant="contained" color="secondary" onClick={onEditNodes}>
          Open Node Editor
        </Button>
        <Button variant="contained" color="primary" onClick={onViewRiskReport}>
          View Risk Report
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
