import React from "react";

interface NodeData {
    id: string;
    errorRate: number;
}

interface Connection {
    id: string;
    source: string;
    target: string;
    error_propagation_factor: number;
}

interface AnalyticsProps {
    nodes: NodeData[];
    connections: Connection[];
}

const Analytics: React.FC<AnalyticsProps> = ({ nodes, connections }) => {
    const calculatePropagation = () => {
        const errors: Record<string, number> = {};

    connections.forEach((conn) => {
        const sourceNode = nodes.find((n) => n.id === conn.source);
        if (!sourceNode) return;

        const sourceError = sourceNode.errorRate || 1;
        const propagatedError = sourceError * conn.error_propagation_factor;

      errors[conn.target] = (errors[conn.target] || 1) * propagatedError;
    });

    return errors;
};

const results = calculatePropagation();

return (
    <div>
        <h2>Error Propagation</h2>
        {Object.entries(results).map(([nodeId, errorRate]) => (
            <p key={nodeId}>
                Node {nodeId}: {errorRate.toFixed(2)}%
            </p>
        ))}
    </div>
);
};

export default Analytics;
