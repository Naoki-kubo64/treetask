import { Edge, Node } from '@xyflow/react';
import { TaskData, TaskNode } from '@/store/useTaskStore';

export function findNextActions(nodes: TaskNode[], edges: Edge[]): TaskNode[] {
  // Map of node ID to number of incoming edges (parents)
  const incomingCount = new Map<string, number>();
  
  // Initialize counts
  nodes.forEach(n => incomingCount.set(n.id, 0));
  
  // Count incoming edges
  edges.forEach(edge => {
    const current = incomingCount.get(edge.target) || 0;
    incomingCount.set(edge.target, current + 1);
  });
  
  // Filter nodes:
  // 1. Status is pending
  // 2. Is Root (incoming count === 0)
  const rootNodes = nodes.filter(node => {
     if (node.data.status === 'completed') return false;
     
     const incoming = incomingCount.get(node.id) || 0;
     return incoming === 0;
  });

  // Sort by horizontal position (Leftmost first)
  return rootNodes.sort((a, b) => {
      const xDiff = a.position.x - b.position.x;
      if (Math.abs(xDiff) > 1) return xDiff;
      return a.position.y - b.position.y;
  });
}
