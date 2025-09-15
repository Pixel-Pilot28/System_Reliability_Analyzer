import { useState, useRef, useCallback } from 'react';
import { ReactFlowInstance } from 'reactflow';

let id = 0;
const getId = () => `dndnode_${id++}`;

export function useDragAndDrop() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    async (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowWrapper.current || !reactFlowInstance) {
        return;
      }

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      // Check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode = {
        id: getId(),
        type,
        position,
        data: { 
          label: `${type.charAt(0).toUpperCase() + type.slice(1)} Node`,
          errorRate: 0,
          variables: []
        },
      };

      try {
        // Save the new node to the server
        const response = await fetch('http://127.0.0.1:8001/api/nodes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newNode),
        });

        if (!response.ok) {
          throw new Error('Failed to save new node');
        }

        // Add the node to the graph only after successful save
        reactFlowInstance.addNodes(newNode);
      } catch (error) {
        console.error('Error saving new node:', error);
        alert('Failed to save new node. Please try again.');
      }
    },
    [reactFlowInstance],
  );

  return {
    reactFlowWrapper,
    setReactFlowInstance,
    onDragOver,
    onDrop,
  };
}