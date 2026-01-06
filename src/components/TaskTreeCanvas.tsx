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
import { EdgeCustomizer } from './EdgeCustomizer';
import { Edge } from '@xyflow/react';

const nodeTypes = {
  task: TaskNode,
};

export function TaskTreeCanvas() {
  const pages = useTaskStore((state) => state.pages);
  const activePageId = useTaskStore((state) => state.activePageId);
  
  const activePage = pages.find(p => p.id === activePageId);
  const nodes = activePage?.nodes || [];
  const edges = activePage?.edges || [];

  const onNodesChange = useTaskStore((state) => state.onNodesChange);
  const onEdgesChange = useTaskStore((state) => state.onEdgesChange);
  const onConnect = useTaskStore((state) => state.onConnect);
  const addNode = useTaskStore((state) => state.addNode);
  const addEdge = useTaskStore((state) => state.addEdge);
  const deleteNode = useTaskStore((state) => state.deleteNode);
  const activeTypeId = useTaskStore((state) => state.activeTypeId);

  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);

  const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
      event.stopPropagation();
      setSelectedEdgeId(edge.id);
  }, []);

  const onPaneClick = useCallback(() => {
     setSelectedEdgeId(null);
  }, []);

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
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        deleteKeyCode={['Backspace', 'Delete']}
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        panOnScroll={false}
        nodesDraggable={true} // Nodes are draggable, canvas is not
      >
        <Background />
        <Controls showInteractive={false} />
        <MiniMap zoomable pannable className='!bg-card !border-border' nodeColor={() => 'hsl(var(--primary))'} />
        
        {selectedEdgeId && (
            <EdgeCustomizer 
               edgeId={selectedEdgeId} 
               onClose={() => setSelectedEdgeId(null)} 
            />
        )}

        <Panel position="top-left" className="bg-card/80 backdrop-blur p-2 rounded-lg border shadow-sm flex gap-2">
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
