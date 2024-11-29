import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { PlusCircle, Trash2, Settings2, ChevronRight, AlertCircle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

const generateCurvePath = (start, end) => {
  const controlPoint1x = start.x + (end.x - start.x) * 0.5;
  const controlPoint1y = start.y;
  const controlPoint2x = start.x + (end.x - start.x) * 0.5;
  const controlPoint2y = end.y;
  return `M ${start.x} ${start.y} C ${controlPoint1x} ${controlPoint1y}, ${controlPoint2x} ${controlPoint2y}, ${end.x} ${end.y}`;
};

const NodeComponent = ({ node, onConnect, onEdit, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="absolute transform -translate-x-1/2 -translate-y-1/2"
      style={{ left: node.x, top: node.y }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className={`w-48 transition-shadow ${isHovered ? 'shadow-lg' : 'shadow'}`}>
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-sm">{node.label}</h3>
            <div className="flex gap-1">
              <button 
                onClick={() => onEdit(node)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Settings2 className="w-4 h-4 text-gray-600" />
              </button>
              <button 
                onClick={() => onDelete(node.id)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Trash2 className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            Error Rate: {(node.errorRate * 100).toFixed(1)}%
          </div>
          {node.variables?.length > 0 && (
            <div className="mt-2 space-y-1">
              {node.variables.map((variable, idx) => (
                <div key={idx} className="flex justify-between text-xs">
                  <span>{variable.name}</span>
                  <span className="text-gray-600">{variable.value}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const Sidebar = ({ onAddNode, selectedNode, onUpdateNode }) => {
  const nodeTypes = ['Environment', 'User', 'Machine'];
  
  return (
    <div className="w-64 border-r bg-gray-50 p-4 h-full overflow-y-auto">
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">Process Gap</h2>
          <div className="space-y-2">
            {nodeTypes.map((type) => (
              <Button
                key={type}
                onClick={() => onAddNode(type)}
                variant="outline"
                className="w-full justify-start"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Add {type} Node
              </Button>
            ))}
          </div>
        </div>
        
        {selectedNode && (
          <div className="space-y-4">
            <h3 className="font-medium">Node Configuration</h3>
            <div className="space-y-2">
              <Label>Name</Label>
              <Input 
                value={selectedNode.label}
                onChange={(e) => onUpdateNode({
                  ...selectedNode,
                  label: e.target.value
                })}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Error Rate</Label>
              <Slider
                value={[selectedNode.errorRate * 100]}
                max={100}
                step={1}
                className="my-4"
                onValueChange={(value) => onUpdateNode({
                  ...selectedNode,
                  errorRate: value[0] / 100
                })}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Variables</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const variables = [...(selectedNode.variables || [])];
                    variables.push({ name: 'New Variable', value: '0' });
                    onUpdateNode({
                      ...selectedNode,
                      variables
                    });
                  }}
                >
                  <PlusCircle className="w-4 h-4" />
                </Button>
              </div>
              
              {selectedNode.variables?.map((variable, idx) => (
                <div key={idx} className="flex gap-2">
                  <Input
                    value={variable.name}
                    onChange={(e) => {
                      const variables = [...selectedNode.variables];
                      variables[idx].name = e.target.value;
                      onUpdateNode({
                        ...selectedNode,
                        variables
                      });
                    }}
                    className="flex-1"
                  />
                  <Input
                    value={variable.value}
                    onChange={(e) => {
                      const variables = [...selectedNode.variables];
                      variables[idx].value = e.target.value;
                      onUpdateNode({
                        ...selectedNode,
                        variables
                      });
                    }}
                    className="w-24"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const variables = [...selectedNode.variables];
                      variables.splice(idx, 1);
                      onUpdateNode({
                        ...selectedNode,
                        variables
                      });
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ProcessGapVisualizer = () => {
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [systemError, setSystemError] = useState(0);
  
  useEffect(() => {
    if (nodes.length === 0) {
      setSystemError(0);
      return;
    }
    
    const totalError = nodes.reduce((acc, node) => {
      const connectedNodes = connections.filter(conn => 
        conn.source === node.id || conn.target === node.id
      );
      const connectionFactor = Math.max(0.1, connectedNodes.length * 0.2);
      return acc + (node.errorRate * connectionFactor);
    }, 0);
    
    setSystemError(totalError / nodes.length);
  }, [nodes, connections]);

  const handleAddNode = (type) => {
    const newNode = {
      id: `node-${nodes.length + 1}`,
      label: `${type} Node ${nodes.length + 1}`,
      type,
      x: 200 + Math.random() * 400,
      y: 200 + Math.random() * 200,
      errorRate: 0.05,
      variables: []
    };
    setNodes([...nodes, newNode]);
  };

  const handleUpdateNode = (updatedNode) => {
    setNodes(nodes.map(node => 
      node.id === updatedNode.id ? updatedNode : node
    ));
  };

  const handleDeleteNode = (nodeId) => {
    setNodes(nodes.filter(node => node.id !== nodeId));
    setConnections(connections.filter(conn => 
      conn.source !== nodeId && conn.target !== nodeId
    ));
  };

  return (
    <div className="flex h-screen">
      <Sidebar
        onAddNode={handleAddNode}
        selectedNode={selectedNode}
        onUpdateNode={handleUpdateNode}
      />
      
      <div className="flex-1 relative bg-gray-100">
        <div className="absolute top-4 right-4 z-10">
          <Card className="w-64">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <h3 className="font-medium">System Error Rate</h3>
              </div>
              <div className="text-2xl font-semibold text-red-500">
                {(systemError * 100).toFixed(1)}%
              </div>
            </CardContent>
          </Card>
        </div>

        <svg className="w-full h-full">
          {connections.map((conn, idx) => {
            const sourceNode = nodes.find(n => n.id === conn.source);
            const targetNode = nodes.find(n => n.id === conn.target);
            if (!sourceNode || !targetNode) return null;
            
            return (
              <path
                key={idx}
                d={generateCurvePath(
                  { x: sourceNode.x, y: sourceNode.y },
                  { x: targetNode.x, y: targetNode.y }
                )}
                fill="none"
                stroke="#94a3b8"
                strokeWidth="2"
                className="transition-colors"
              />
            );
          })}
        </svg>

        {nodes.map(node => (
          <NodeComponent
            key={node.id}
            node={node}
            onEdit={() => setSelectedNode(node)}
            onDelete={handleDeleteNode}
          />
        ))}
      </div>
    </div>
  );
};

export default ProcessGapVisualizer;