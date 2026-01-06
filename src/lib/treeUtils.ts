import { Edge, Node } from '@xyflow/react';
import { TaskData, TaskNode } from '@/store/useTaskStore';

export function findNextActions(nodes: TaskNode[], edges: Edge[]): TaskNode[] {
  // Map of node ID to number of outgoing edges (children)
  const childCount = new Map<string, number>();
  
  // Initialize counts
  nodes.forEach(n => childCount.set(n.id, 0));
  
  // Count children (target is the child in a breakdown tree? Or source?)
  // Usually: Goal (Root) -> Subtask (Child)
  // Edges go from Source to Target.
  // So Root is Source. Subtask is Target.
  // A Leaf has 0 outgoing edges?
  // Wait, if Root -> A, Root -> B. Root has 2 outgoing. A, B have 0.
  // So yes, Leaves are targets with 0 outgoing edges.
  
  edges.forEach(edge => {
    const current = childCount.get(edge.source) || 0;
    childCount.set(edge.source, current + 1);
  });
  
  // Filter nodes:
  // 1. Status is pending
  // 2. Is Leaf (outgoing count === 0)
  
  return nodes.filter(node => {
     if (node.data.status === 'completed') return false;
     
     const outgoing = childCount.get(node.id) || 0;
     return outgoing === 0;
  });
}
