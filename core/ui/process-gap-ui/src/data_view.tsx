import React, { useCallback, useState } from 'react';
import {
  Background,
  Connection,
  Controls,
  ReactFlow,
  ReactFlowProvider,
  Node,
  Edge,
  NodeMouseHandler,
  addEdge,
  useEdgesState,
  useNodesState,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import './styles/dndflow.css';

import { Sidebar } from './components/Sidebar';
import { useDragAndDrop } from './hooks/useDragAndDrop';

interface DataViewProps {
  nodes: Node[];
  edges: Edge[];
  onNodeClick: NodeMouseHandler;
}

function Flow({ nodes: inputNodes, edges: inputEdges, onNodeClick }: DataViewProps) {
  // Initialize states with the input nodes and edges
  const [nodes, setNodes, onNodesChange] = useNodesState(inputNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(inputEdges);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string>('');

  // Handle edge removal
  const onEdgeDelete = useCallback(
    async (edge: Edge) => {
      try {
        const response = await fetch(`http://127.0.0.1:8001/api/edges/${edge.id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete edge');
        }

        setSaveStatus('Connection removed!');
        setTimeout(() => setSaveStatus(''), 2000);
      } catch (error) {
        console.error('Error deleting edge:', error);
        setSaveStatus('Failed to remove connection');
        setTimeout(() => setSaveStatus(''), 3000);
      }
    },
    [setSaveStatus]
  );

  // Handle edges changes including deletions
  const handleEdgesChange = useCallback(
    (changes: any[]) => {
      onEdgesChange(changes);
      
      // Handle edge deletions
      changes.forEach(change => {
        if (change.type === 'remove') {
          onEdgeDelete(change.item);
        }
      });
    },
    [onEdgesChange, onEdgeDelete]
  );

  // Get drag and drop functionality
  const { reactFlowWrapper, setReactFlowInstance, onDragOver, onDrop } = useDragAndDrop();

  // Handle connections
  const onConnect = useCallback(
    async (params: Connection) => {
      // Create the new edge with a unique ID
      const newEdge = {
        ...params,
        id: `e${params.source}-${params.target}`,
      };
      
      // Save the edge to the backend
      try {
        const response = await fetch('http://127.0.0.1:8001/api/edges', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newEdge),
        });

        if (!response.ok) {
          throw new Error('Failed to save edge');
        }

        // If successful, update the edges state
        setEdges((eds) => addEdge(newEdge, eds));
        setSaveStatus('Connection saved!');
        setTimeout(() => setSaveStatus(''), 2000);
      } catch (error) {
        console.error('Error saving edge:', error);
        setSaveStatus('Failed to save connection');
        setTimeout(() => setSaveStatus(''), 3000);
      }
    },
    [setEdges, setSaveStatus],
  );

  // Save all node positions
  const saveAllPositions = useCallback(async () => {
    setIsSaving(true);
    setSaveStatus('Saving...');
    
    try {
      const results = await Promise.allSettled(nodes.map(node => 
        fetch(`http://127.0.0.1:8001/api/nodes/${node.id}/position`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(node.position),
        }).then(async response => {
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
          }
          return response.json();
        })
      ));

      const failures = results.filter(r => r.status === 'rejected');
      if (failures.length > 0) {
        console.error('Some positions failed to save:', failures);
        setSaveStatus(`${failures.length} position(s) failed to save. Check console for details.`);
      } else {
        setSaveStatus('All positions saved successfully!');
      }
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      console.error('Error saving positions:', error);
      setSaveStatus(`Error saving positions: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsSaving(false);
    }
  }, [nodes]);

  // Handle node drag end
  const onNodeDragStop = useCallback((event: React.MouseEvent, node: Node) => {
    console.log('Node dragged:', node);
    setSaveStatus('Saving position...');
    
    fetch(`http://127.0.0.1:8001/api/nodes/${node.id}/position`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(node.position),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to update node position');
      }
      return response.json();
    })
    .then(data => {
      console.log('Position updated successfully:', data);
      setSaveStatus('Position saved!');
      setTimeout(() => setSaveStatus(''), 2000);
    })
    .catch(error => {
      console.error('Error updating node position:', error);
      setSaveStatus('Error saving position');
      setTimeout(() => setSaveStatus(''), 3000);
    });
  }, []);

  return (
    <div className="dndflow" style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Sidebar />
      <div className="reactflow-wrapper" style={{ width: '100%', height: '100%' }} ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={handleEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onNodeDragStop={onNodeDragStop}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onInit={setReactFlowInstance}
          fitView
        >
          <Background />
          <Controls />
          <Panel position="top-right">
            <button
              onClick={saveAllPositions}
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
              {isSaving ? 'Saving...' : 'Save Positions'}
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
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
}

// Wrap with provider
const DataView: React.FC<DataViewProps> = (props) => {
  return (
    <ReactFlowProvider>
      <Flow {...props} />
    </ReactFlowProvider>
  );
};

export default DataView;

