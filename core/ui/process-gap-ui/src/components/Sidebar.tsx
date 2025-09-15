import React from 'react';

const nodeTypes = [
  { type: 'input', label: 'Input Node', color: '#6ede87' },
  { type: 'default', label: 'Default Node', color: '#ff9a9e' },
  { type: 'output', label: 'Output Node', color: '#6e95ed' },
];

export const Sidebar = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside style={{
      position: 'absolute',
      left: '10px',
      top: '10px',
      padding: '10px',
      fontSize: '12px',
      background: 'rgba(255, 255, 255, 0.9)',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      zIndex: 1000,
    }}>
      <div style={{ 
        marginBottom: '8px', 
        fontWeight: 'bold',
        color: '#333',
      }}>
        Add Nodes
      </div>
      {nodeTypes.map((node) => (
        <div
          key={node.type}
          className="dndnode sidebar-node"
          onDragStart={(event) => onDragStart(event, node.type)}
          draggable
          style={{
            padding: '8px 12px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            margin: '4px 0',
            background: node.color,
            color: '#fff',
            cursor: 'grab',
            fontSize: '11px',
            textShadow: '0 1px 2px rgba(0,0,0,0.2)',
            transition: 'transform 0.2s, box-shadow 0.2s'
          }}
        >
          {node.label}
        </div>
      ))}
    </aside>
  );
};