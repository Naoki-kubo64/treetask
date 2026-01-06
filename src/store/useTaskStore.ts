import { create } from 'zustand';
import { 
  Edge, 
  Node, 
  OnNodesChange, 
  OnEdgesChange, 
  OnConnect, 
  applyNodeChanges, 
  applyEdgeChanges, 
  addEdge,
  Connection
} from '@xyflow/react';
import { Skin } from '@/lib/skins';

export interface TaskData {
  label: string;
  status: 'pending' | 'completed';
  description?: string;
  [key: string]: unknown;
}

export type TaskNode = Node<TaskData>;

interface TaskState {
  nodes: TaskNode[];
  edges: Edge[];
  skin: Skin;
  
  onNodesChange: OnNodesChange<TaskNode>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  
  setSkin: (skin: Skin) => void;
  addNode: (node: TaskNode) => void;
  updateNodeData: (id: string, data: Partial<TaskData>) => void;
  toggleNodeStatus: (id: string) => void;
  deleteNode: (id: string) => void;
}

const initialNodes: TaskNode[] = [
  {
    id: 'root',
    type: 'task',
    position: { x: 0, y: 0 },
    data: { label: 'Main Goal', status: 'pending' },
    deletable: false,
  },
];

export const useTaskStore = create<TaskState>((set, get) => ({
  nodes: initialNodes,
  edges: [],
  skin: 'refined',

  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection: Connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },

  setSkin: (skin) => set({ skin }),

  addNode: (node) => set((state) => ({ nodes: [...state.nodes, node] })),

  updateNodeData: (id, data) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, ...data } } : node
      ),
    })),

  toggleNodeStatus: (id) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                status: node.data.status === 'pending' ? 'completed' : 'pending',
              },
            }
          : node
      ),
    })),
    
  deleteNode: (id) =>
      set((state) => ({
          nodes: state.nodes.filter(n => n.id !== id),
          edges: state.edges.filter(e => e.source !== id && e.target !== id)
      })),
}));
