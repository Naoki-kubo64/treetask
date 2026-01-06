import { Edge, Node } from '@xyflow/react';
import { TaskData, TaskNode } from '@/store/useTaskStore';

export function findNextActions(nodes: TaskNode[], edges: Edge[]): TaskNode[] {
  // 1. Identify pending nodes
  const pendingNodes = nodes.filter(n => n.data.status === 'pending');
  const completedNodeIds = new Set(nodes.filter(n => n.data.status === 'completed').map(n => n.id));

  // 2. Filter: Include only if ALL parents are completed
  const availableNodes = pendingNodes.filter(node => {
     // Find incoming edges (parents)
     const parentEdges = edges.filter(e => e.target === node.id);
     
     // If no parents (Root), it's available
     if (parentEdges.length === 0) return true;

     // Check if all parents are completed
     const allParentsCompleted = parentEdges.every(edge => completedNodeIds.has(edge.source));
     return allParentsCompleted;
  });

  // 3. Sort by horizontal position (Leftmost first), then vertical
  return availableNodes.sort((a, b) => {
      const xDiff = a.position.x - b.position.x;
      if (Math.abs(xDiff) > 10) return xDiff; // Group by column roughly
      return a.position.y - b.position.y;
  });
}
