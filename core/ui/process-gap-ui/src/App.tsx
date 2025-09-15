import React, { useState, useEffect } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import Dashboard from "./dashboard";
import DataView from "./data_view";
import NodeEditor from "./node_editor";
import Analytics from "./analytics";
import LiveFeed from "./live_feed";
import { Node, Edge } from "reactflow";

interface Variable {
  name: string;
  value: string | number;
}

interface Position {
  x: number;
  y: number;
}

interface CustomNodeData {
  id: string;
  label: string;
  errorRate: number;
  position?: Position;
  variables?: Variable[];
}

interface CustomEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  error_propagation_factor: number;
}

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<"dashboard" | "dataView" | "nodeEditor" | "riskReport"  | "liveFeed">(
    "dashboard"
  );
  const [nodes, setNodes] = useState<CustomNodeData[]>([]);
  const [edges, setEdges] = useState<CustomEdge[]>([]);
  const [selectedNode, setSelectedNode] = useState<CustomNodeData | null>(null);

  // Fetch failure tree data on component mount or when tab changes to dataView
  useEffect(() => {
    if (currentTab === "dataView") {
      fetch("http://127.0.0.1:8001/api/failure-tree")
        .then((response) => response.json())
        .then((data) => {
          console.log("Received data:", data); // Debug log
          setNodes(data.nodes);
          setEdges(
            data.connections.map((conn: any) => ({
              id: `${conn.source}-${conn.target}`,
              source: conn.source,
              target: conn.target,
              label: `Factor: ${conn.error_propagation_factor}`,
              error_propagation_factor: conn.error_propagation_factor,
            }))
          );
        })
        .catch((error) => {
          console.error("Failed to fetch failure tree data:", error);
        });
    }
  }, [currentTab]);

  const reactFlowNodes: Node[] = nodes.map((node) => {
    // Use stored position or generate a stable position based on node ID
    const hash = node.id.split('').reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
    const defaultPosition = {
      x: (Math.abs(hash) % 800) + 100, // Between 100 and 900
      y: (Math.abs(hash >> 8) % 600) + 100 // Between 100 and 700
    };

    return {
      id: node.id,
      position: node.position || defaultPosition,
      data: {
        label: node.label,
        errorRate: node.errorRate,
        variables: node.variables || [],
      },
      type: 'default',
    };
  });

  // Map CustomEdge to React Flow Edge
  const reactFlowEdges: Edge[] = edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    label: edge.label,
  }));

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue as typeof currentTab);
  };

  // Save node edits
  const saveNodeEdit = (updatedNode: CustomNodeData) => {
    fetch(`http://127.0.0.1:8001/api/nodes/${updatedNode.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedNode),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to save node edits.");
        }
        return response.json();
      })
      .then(() => {
        setNodes((prevNodes) =>
          prevNodes.map((node) => (node.id === updatedNode.id ? updatedNode : node))
        );
      })
      .catch((error) => console.error("Failed to save node:", error));
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Left Panel with Tabs */}
      <Box
        sx={{
          width: 240,
          bgcolor: "background.paper",
          borderRight: 1,
          borderColor: "divider",
          overflowY: "auto",
        }}
      >
        <Tabs
          orientation="vertical"
          value={currentTab}
          onChange={handleTabChange}
          aria-label="Process Gap Views"
          sx={{
            "& .MuiTab-root": {
              transition: "background-color 0.3s ease",
            },
            "& .MuiTab-root:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.08)",
            },
            "& .MuiTab-root.Mui-selected": {
              backgroundColor: "rgba(0, 0, 0, 0.12)",
            },
          }}
        >
          <Tab label="Dashboard" value="dashboard" />
          <Tab label="Process Gap Visualization" value="dataView" />
          <Tab label="Node Editor" value="nodeEditor" />
          <Tab label="Risk Report" value="riskReport" />
          <Tab label="Live Feed" value="liveFeed" /> 
        </Tabs>
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, p: 3 }}>
        {currentTab === "dashboard" && (
          <Dashboard
            systemErrorRate={12.5}
            onViewGraph={() => setCurrentTab("dataView")}
            onEditNodes={() => setCurrentTab("nodeEditor")}
            onViewRiskReport={() => setCurrentTab("riskReport")}
          />
        )}
        {currentTab === "dataView" && (
          <DataView
            nodes={reactFlowNodes}
            edges={reactFlowEdges}
            onNodeClick={(event, node) => {
              const selected = nodes.find((n) => n.id === node.id);
              if (selected) {
                setSelectedNode(selected);
                setCurrentTab("nodeEditor");
              }
            }}
          />
        )}
        {currentTab === "nodeEditor" && (
          <NodeEditor
            selectedNode={selectedNode}
            onUpdateNode={(updatedNode) => {
              saveNodeEdit(updatedNode);
            }}
          />
        )}
        {currentTab === "liveFeed" && <LiveFeed />}        
        {currentTab === "riskReport" && <Analytics nodes={nodes} connections={edges} />}
      </Box>
    </Box>
  );
};

export default App;