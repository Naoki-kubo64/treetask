import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { temporal } from 'zundo';
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

export interface Page {
    id: string;
    name: string;
    nodes: TaskNode[];
    edges: Edge[];
}

interface TaskState {
  // Global State
  skin: Skin;
  taskTypes: TaskType[];
  activeTypeId: string;
  
  // Page State
  pages: Page[];
  activePageId: string;
  
  // Search State
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Dragging State
  isDragging: boolean;
  setIsDragging: (isDragging: boolean) => void;

  // Actions
  onNodesChange: OnNodesChange<TaskNode>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  
  setSkin: (skin: Skin) => void;
  
  // Node Actions (operate on active page)
  addNode: (node: TaskNode) => void;
  addEdge: (edge: Edge) => void;
  updateNodeData: (id: string, data: Partial<TaskData>) => void;
  toggleNodeStatus: (id: string) => void;
  deleteNode: (id: string) => void;
  updateEdge: (id: string, data: Partial<Edge>) => void;
  
  // Type Actions
  addTaskType: (type: TaskType) => void;
  updateTaskType: (id: string, type: Partial<TaskType>) => void;
  deleteTaskType: (id: string) => void;
  setActiveTypeId: (id: string) => void;
  
  // Page Actions
  addPage: (name: string) => void;
  deletePage: (id: string) => void;
  setActivePage: (id: string) => void;
  updatePageName: (id: string, name: string) => void;
  importData: (data: TaskState) => void;
}

const initialPageId = 'page-1';
const initialNodes: TaskNode[] = [
  {
    id: 'root',
    type: 'task',
    position: { x: 50, y: 150 },
    data: { label: 'Ready', status: 'pending' as const },
    deletable: false,
  },
];

export const useTaskStore = create<TaskState>()(persist(temporal((set, get) => ({
  skin: 'frost',
  taskTypes: [
    { id: 'default', name: 'Task', color: 'hsl(var(--primary))' },
    { id: 'goal', name: 'Goal', color: '#ef4444' }, 
    { id: 'memo', name: 'Memo', color: '#f59e0b' }, 
  ],
  activeTypeId: 'default',
  
  pages: [
      { id: initialPageId, name: 'Main Plan', nodes: initialNodes, edges: [] }
  ],
  activePageId: initialPageId,

  onNodesChange: (changes) => {
    set((state) => {
        const page = state.pages.find(p => p.id === state.activePageId);
        if (!page) return state;
        
        const newNodes = applyNodeChanges<TaskNode>(changes, page.nodes);
        const newPages = state.pages.map(p => p.id === state.activePageId ? { ...p, nodes: newNodes } : p);
        
        return { pages: newPages };
    });
  },
  onEdgesChange: (changes) => {
    set((state) => {
        const page = state.pages.find(p => p.id === state.activePageId);
        if (!page) return state;
        
        const newEdges = applyEdgeChanges(changes, page.edges);
        const newPages = state.pages.map(p => p.id === state.activePageId ? { ...p, edges: newEdges } : p);
        
        return { pages: newPages };
    });
  },
  onConnect: (connection: Connection) => {
    set((state) => {
        const page = state.pages.find(p => p.id === state.activePageId);
        if (!page) return state;
        
        const newEdge = { ...connection, type: 'default', style: { strokeWidth: 2, stroke: '#888', strokeDasharray: 'none' } }; 
        const newEdges = addEdge(newEdge, page.edges);
        const newPages = state.pages.map(p => p.id === state.activePageId ? { ...p, edges: newEdges } : p);
        
        return { pages: newPages };
    });
  },

  setSkin: (skin) => set({ skin }),

  addNode: (node) => set((state) => {
      const page = state.pages.find(p => p.id === state.activePageId);
      if (!page) return state;
      const newPages = state.pages.map(p => p.id === state.activePageId ? { ...p, nodes: [...p.nodes, node] } : p);
      return { pages: newPages };
  }),
  
  addEdge: (edge) => set((state) => {
      const page = state.pages.find(p => p.id === state.activePageId);
      if (!page) return state;
      // Ensure default style
      const styledEdge = { ...edge, style: { strokeWidth: 2, stroke: '#888', strokeDasharray: 'none', ...edge.style } };
      const newPages = state.pages.map(p => p.id === state.activePageId ? { ...p, edges: [...p.edges, styledEdge] } : p);
      return { pages: newPages };
  }),

  updateEdge: (id, data) => set((state) => {
      const page = state.pages.find(p => p.id === state.activePageId);
      if (!page) return state;
      
      const newEdges = page.edges.map((edge) =>
          edge.id === id ? { ...edge, ...data, style: { ...edge.style, ...data.style } } : edge
      );
      const newPages = state.pages.map(p => p.id === state.activePageId ? { ...p, edges: newEdges } : p);
      return { pages: newPages };
  }),

  updateNodeData: (id, data) =>
    set((state) => {
        const page = state.pages.find(p => p.id === state.activePageId);
        if (!page) return state;
        
        const newNodes = page.nodes.map((node) =>
            node.id === id ? { ...node, data: { ...node.data, ...data } } : node
        );
        const newPages = state.pages.map(p => p.id === state.activePageId ? { ...p, nodes: newNodes } : p);
        return { pages: newPages };
    }),

  toggleNodeStatus: (id) =>
    set((state) => {
        const page = state.pages.find(p => p.id === state.activePageId);
        if (!page) return state;
        
        const newNodes = page.nodes.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                status: (node.data.status === 'pending' ? 'completed' : 'pending') as 'pending' | 'completed',
              },
            }
          : node
        );
        const newPages = state.pages.map(p => p.id === state.activePageId ? { ...p, nodes: newNodes } : p);
        return { pages: newPages };
    }),
    
  deleteNode: (id) =>
      set((state) => {
        const page = state.pages.find(p => p.id === state.activePageId);
        if (!page) return state;
        
        const newNodes = page.nodes.filter(n => n.id !== id);
        const newEdges = page.edges.filter(e => e.source !== id && e.target !== id);
        const newPages = state.pages.map(p => p.id === state.activePageId ? { ...p, nodes: newNodes, edges: newEdges } : p);
        return { pages: newPages };
      }),

  addTaskType: (type) => set((state) => ({ taskTypes: [...state.taskTypes, type] })),
  
  updateTaskType: (id, type) => set((state) => ({
      taskTypes: state.taskTypes.map(t => t.id === id ? { ...t, ...type } : t)
  })),
  
  deleteTaskType: (id) => set((state) => ({
      taskTypes: state.taskTypes.filter(t => t.id !== id),
  })),
  
  setActiveTypeId: (id) => set({ activeTypeId: id }),
  
  addPage: (name) => set((state) => {
      const id = `page-${Date.now()}`;
      // New Page starts with a Root node?
      const rootNode: TaskNode = {
          id: `root-${id}`,
          type: 'task',
          position: { x: 50, y: 150 },
          data: { label: name, status: 'pending' as const },
          deletable: false,
      };
      
      return { 
          pages: [...state.pages, { id, name, nodes: [rootNode], edges: [] }],
          activePageId: id
      };
  }),
  
  deletePage: (id) => set((state) => {
      if (state.pages.length <= 1) return state; // Don't delete last page
      const newPages = state.pages.filter(p => p.id !== id);
      const newActiveId = state.activePageId === id ? newPages[0].id : state.activePageId;
      return { pages: newPages, activePageId: newActiveId };
  }),
  
  setActivePage: (id) => set({ activePageId: id }),
  
  updatePageName: (id, name) => set(state => ({
      pages: state.pages.map(p => p.id === id ? { ...p, name } : p)
  })),

  importData: (data) => set({
      skin: data.skin,
      taskTypes: data.taskTypes,
      activeTypeId: data.activeTypeId,
      pages: data.pages,
      activePageId: data.activePageId
  }),
  
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),

  isDragging: false,
  setIsDragging: (isDragging) => set({ isDragging }),

}), {
    equality: (past, current) => {
        if (past.isDragging) return true;
        return past === current; 
    }
}), {
    name: 'startree-storage',
    partialize: (state) => ({ 
        skin: state.skin,
        taskTypes: state.taskTypes,
        activeTypeId: state.activeTypeId,
        pages: state.pages,
        activePageId: state.activePageId
    }),
}));
