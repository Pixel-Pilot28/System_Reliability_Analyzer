import React, { useState, useEffect } from "react";

interface Variable {
  name: string;
  value: string | number;
}

interface Node {
  id: string;
  label: string;
  errorRate: number;
  variables?: Variable[];
}

interface NodeEditorProps {
  selectedNode: Node | null;
  onUpdateNode: (node: Node) => void;
}

const NodeEditor: React.FC<NodeEditorProps> = ({ selectedNode, onUpdateNode }) => {
  const [node, setNode] = useState<Node | null>(null);

  useEffect(() => {
    setNode(selectedNode);
  }, [selectedNode]);

  const handleFieldChange = (field: keyof Node, value: any) => {
    if (node) {
      setNode({ ...node, [field]: value }); // Update field value locally
    }
  };

  const handleSave = () => {
    if (node) {
      fetch(`http://127.0.0.1:8000/api/nodes/${node.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(node),
      })
        .then((res) => res.json())
        .then((data) => {
          onUpdateNode(data.updated_node); // Reflect changes in parent component
        });
    }
  };

  if (!node) {
    return <p>No node selected. Click a node to edit its details.</p>;
  }

  return (
    <div style={{ padding: "20px", backgroundColor: "#f9f9f9", color: "#333" }}>
      <h2>Edit Node: {node.label}</h2>

      <label>
        Label:
        <input
          type="text"
          value={node.label}
          onChange={(e) => handleFieldChange("label", e.target.value)}
        />
      </label>
      <br />

      <label>
        Error Rate:
        <input
          type="number"
          value={node.errorRate}
          onChange={(e) => handleFieldChange("errorRate", parseFloat(e.target.value))}
        />
      </label>
      <br />

      <h3>Variables:</h3>
      {node.variables?.map((variable, idx) => (
        <div key={idx}>
          <label>
            {variable.name}:
            <input
              type="text"
              value={variable.value}
              onChange={(e) => {
                const updatedVariables = [...(node.variables || [])];
                updatedVariables[idx].value = e.target.value;
                handleFieldChange("variables", updatedVariables);
              }}
            />
          </label>
        </div>
      ))}

      <button onClick={handleSave}>Save Changes</button>
    </div>
  );
};

export default NodeEditor;
