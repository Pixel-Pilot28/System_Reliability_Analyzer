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

  const [saveStatus, setSaveStatus] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (node) {
      setIsSaving(true);
      setSaveStatus('Saving...');
      try {
        const response = await fetch(`http://127.0.0.1:8001/api/nodes/${node.id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(node),
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        if (data.success) {
          onUpdateNode(node); // Reflect changes in parent component
          setSaveStatus('Changes saved successfully!');
          setTimeout(() => setSaveStatus(''), 3000);
        } else {
          throw new Error(data.error || 'Failed to save changes');
        }
      } catch (error) {
        console.error('Error saving node:', error);
        setSaveStatus('Error saving changes. Please try again.');
      } finally {
        setIsSaving(false);
      }
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

      <button 
        onClick={handleSave}
        disabled={isSaving}
        style={{
          padding: '8px 16px',
          backgroundColor: isSaving ? '#ccc' : '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isSaving ? 'not-allowed' : 'pointer',
          marginRight: '10px'
        }}
      >
        {isSaving ? 'Saving...' : 'Save Changes'}
      </button>
      {saveStatus && (
        <span style={{
          marginLeft: '10px',
          padding: '8px',
          backgroundColor: saveStatus.includes('Error') ? '#ffebee' : '#e8f5e9',
          borderRadius: '4px',
          color: saveStatus.includes('Error') ? '#c62828' : '#2e7d32'
        }}>
          {saveStatus}
        </span>
      )}
    </div>
  );
};

export default NodeEditor;
