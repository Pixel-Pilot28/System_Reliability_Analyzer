import React, { useState, useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  Node,
  Edge,
  NodeMouseHandler,
} from "reactflow";
import "reactflow/dist/style.css";

interface CustomNodeData {
  label: string;
  errorRate: number;
}

type CustomNode = Node<CustomNodeData>;
type CustomEdge = Edge;

interface DataViewProps {
  nodes: CustomNode[];
  edges: CustomEdge[];
  onNodeClick: NodeMouseHandler;
}

const DataView: React.FC<DataViewProps> = ({ nodes, edges, onNodeClick }) => {
  return (
    <div style={{ height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodeClick={onNodeClick}
        fitView
      >
        <Background color="#aaa" gap={16} />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default DataView;

// const DataView: React.FC<DataViewProps> = ({ nodes, edges, onNodeClick }) => {
//   const [viewNodes, setViewNodes] = useState<CustomNode[]>([]);
//   const [viewEdges, setViewEdges] = useState<CustomEdge[]>([]);

//   useEffect(() => {
//     // Set nodes and edges when props change
//     setViewNodes(nodes);
//     setViewEdges(edges);
//   }, [nodes, edges]);

//   return (
//     <div style={{ height: "100vh" }}>
//       <ReactFlow
//         nodes={viewNodes}
//         edges={viewEdges}
//         onNodeClick={onNodeClick as NodeMouseHandler}
//         fitView
//       >
//         <Background color="#aaa" gap={16} />
//         <Controls />
//       </ReactFlow>
//     </div>
//   );
// };

// export default DataView;

