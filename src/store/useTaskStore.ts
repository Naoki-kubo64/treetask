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

export interface TaskType {
  id: string;
  name: string;
  color: string;
}

export interface TaskData {
  label: string;
  status: 'pending' | 'completed';
  description?: string;
  typeId?: string;
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
  addEdge: (edge: Edge) => void;
  updateNodeData: (id: string, data: Partial<TaskData>) => void;
  toggleNodeStatus: (id: string) => void;
  deleteNode: (id: string) => void;
  
  taskTypes: TaskType[];
  activeTypeId: string; // The type newly created tasks will use
  addTaskType: (type: TaskType) => void;
  updateTaskType: (id: string, type: Partial<TaskType>) => void;
  deleteTaskType: (id: string) => void;
  setActiveTypeId: (id: string) => void;
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
  
  taskTypes: [
    { id: 'default', name: 'Task', color: 'hsl(var(--primary))' },
    { id: 'goal', name: 'Goal', color: '#ef4444' }, // red-500
    { id: 'memo', name: 'Memo', color: '#f59e0b' }, // amber-500
  ],
  activeTypeId: 'default',

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
  addEdge: (edge) => set((state) => ({ edges: [...state.edges, edge] })),

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

  addTaskType: (type) => set((state) => ({ taskTypes: [...state.taskTypes, type] })),
  
  updateTaskType: (id, type) => set((state) => ({
      taskTypes: state.taskTypes.map(t => t.id === id ? { ...t, ...type } : t)
  })),
  
  deleteTaskType: (id) => set((state) => ({
      taskTypes: state.taskTypes.filter(t => t.id !== id),
      // Optionally reset typeId of nodes that had this type?
      // For now let's keep it simple.
  })),
  
  setActiveTypeId: (id) => set({ activeTypeId: id }),
}));
