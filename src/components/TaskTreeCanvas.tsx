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
import { useCallback } from 'react';

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

  // Simple handler to add a node for demo purposes (double click on background?)
  // For now, let's just rely on the initial node and maybe a panel button.
  
  const handleAddNode = () => {
     const id = `node-${Date.now()}`;
     addNode({
         id,
         type: 'task',
         position: { x: Math.random() * 400, y: Math.random() * 400 },
         data: { label: 'New Task', status: 'pending' }
     });
  };

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
      >
        <Background />
        <Controls />
        <MiniMap zoomable pannable className='!bg-card !border-border' nodeColor={() => 'hsl(var(--primary))'} />
        
        <Panel position="top-left" className="bg-card/80 backdrop-blur p-2 rounded-lg border shadow-sm flex gap-2">
          <button 
             onClick={handleAddNode}
             className="px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
          >
            + Add Task
          </button>
           <div className="text-xs text-muted-foreground self-center px-2 border-l">
              Drag to connect nodes
           </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}
