'use client';

import { 
  ReactFlow, 
  Background, 
  Controls, 
  MiniMap,
  Panel,
  useNodesState,
  useEdgesState
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useTaskStore } from '@/store/useTaskStore';
import { TaskNode } from './TaskNode';
import { useCallback, useState } from 'react';
import { Lock, Unlock } from 'lucide-react';

const nodeTypes = {
  task: TaskNode,
};

export function TaskTreeCanvas() {
  const nodes = useTaskStore((state) => state.nodes);
  const edges = useTaskStore((state) => state.edges);
  const onNodesChange = useTaskStore((state) => state.onNodesChange);
  const onEdgesChange = useTaskStore((state) => state.onEdgesChange);
  const onConnect = useTaskStore((state) => state.onConnect);
  const addNode = useTaskStore((state) => state.addNode);
  const addEdge = useTaskStore((state) => state.addEdge);
  const deleteNode = useTaskStore((state) => state.deleteNode);
  const activeTypeId = useTaskStore((state) => state.activeTypeId);

  const [isLocked, setIsLocked] = useState(false);

  const handleAddNode = useCallback(() => {
     // Find selected node
     const selectedNode = nodes.find(n => n.selected);
     const id = `node-${Date.now()}`;
     
     if (selectedNode) {
         // Auto-connect to selected node
         // Position slightly to the right
         const newNode = {
             id,
             type: 'task',
             position: { 
                 x: selectedNode.position.x + 250, 
                 y: selectedNode.position.y 
             },
             data: { label: 'Sub Task', status: 'pending' as const, typeId: activeTypeId },
             selected: true, // Auto-select new node
         };
         
         addNode(newNode);
         
         const newEdge = {
             id: `e-${selectedNode.id}-${id}`,
             source: selectedNode.id,
             target: id,
             animated: true,
         };
         
         addEdge(newEdge);
     } else {
         // Free placement (randomized near center or safe area)
         addNode({
             id,
             type: 'task',
             position: { x: Math.random() * 200 + 100, y: Math.random() * 200 + 100 },
             data: { label: 'New Task', status: 'pending' as const, typeId: activeTypeId },
             selected: true,
         });
     }
  }, [nodes, addNode, addEdge, activeTypeId]);
  
  const handleDeleteSelected = useCallback(() => {
      const selectedNodes = nodes.filter(n => n.selected);
      // We can use the store's deleteNode or just reactflow's hook/functionality?
      // But store needs to be updated.
      // useTaskStore handles onNodesChange which usually handles deletion if triggered by Keyboard.
      // But for button click, we need to manually trigger deletion.
      
      selectedNodes.forEach(n => {
          if (n.deletable !== false) {
              deleteNode(n.id);
          }
      });
  }, [nodes, deleteNode]);

  return (
    <div className="flex-1 h-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        deleteKeyCode={['Backspace', 'Delete']}
        panOnDrag={!isLocked}
        zoomOnScroll={!isLocked}
        zoomOnPinch={!isLocked}
        panOnScroll={!isLocked}
        nodesDraggable={!isLocked}
      >
        <Background />
        <Controls />
        <MiniMap zoomable pannable className='!bg-card !border-border' nodeColor={() => 'hsl(var(--primary))'} />
        
        <Panel position="top-left" className="bg-card/80 backdrop-blur p-2 rounded-lg border shadow-sm flex gap-2">
          <button
             onClick={() => setIsLocked(!isLocked)}
             className="px-2 py-1.5 text-muted-foreground hover:text-primary transition-colors"
             title={isLocked ? "Unlock Viewport" : "Lock Viewport"}
          >
             {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
          </button>
          <div className="w-px bg-border my-1" />
          <button 
             onClick={handleAddNode}
             className="px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
          >
            + Add Task
          </button>
          <button 
             onClick={handleDeleteSelected}
             className="px-3 py-1.5 text-xs font-medium bg-destructive text-destructive-foreground rounded-md hover:opacity-90 transition-opacity"
             title="Delete Selected (Backspace)"
          >
            Delete
          </button>
           <div className="text-xs text-muted-foreground self-center px-2 border-l">
              {nodes.some(n => n.selected) ? 'Add to connect' : 'Add to place free'}
           </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}
