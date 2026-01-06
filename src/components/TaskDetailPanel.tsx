'use client';

import { useTaskStore } from '@/store/useTaskStore';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, FileText } from 'lucide-react';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';

export function TaskDetailPanel() {
  const pages = useTaskStore((state) => state.pages);
  const activePageId = useTaskStore((state) => state.activePageId);
  const updateNodeData = useTaskStore((state) => state.updateNodeData);
  const activePage = pages.find(p => p.id === activePageId);
  
  // Find THE selected node (assuming single selection for now)
  const selectedNode = activePage?.nodes.find(n => n.selected);

  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
     if (selectedNode) {
         setLabel(selectedNode.data.label);
         setDescription(selectedNode.data.description || '');
         setDueDate(selectedNode.data.dueDate as string || '');
     } else {
         setLabel('');
         setDescription('');
         setDueDate('');
     }
  }, [selectedNode]);

  if (!selectedNode) {
      return (
          <div className="p-4 text-center text-muted-foreground text-sm">
             Select a task to view details.
          </div>
      );
  }

  const handleUpdate = (updates: any) => {
      updateNodeData(selectedNode.id, updates);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
        <div className="p-4 border-b">
           <Input 
              value={label} 
              onChange={(e) => {
                  setLabel(e.target.value);
                  handleUpdate({ label: e.target.value });
              }}
              className="font-bold text-lg mb-2"
              placeholder="Task Name"
           />
           <div className="flex items-center gap-2">
               <span className={`text-xs px-2 py-0.5 rounded-full border ${selectedNode.data.status === 'completed' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'}`}>
                   {selectedNode.data.status}
               </span>
           </div>
        </div>
        
        <div className="p-4 space-y-4 flex-1 overflow-auto">
            <div>
               <label className="text-xs font-medium text-muted-foreground mb-1 block">
                   <CalendarIcon className="w-3 h-3 inline mr-1" />
                   Due Date
               </label>
               <Input 
                   type="date" 
                   value={dueDate} 
                   onChange={(e) => {
                       setDueDate(e.target.value);
                       handleUpdate({ dueDate: e.target.value });
                   }}
               />
            </div>

            <div className="flex flex-col h-full">
               <label className="text-xs font-medium text-muted-foreground mb-1 block">
                   <FileText className="w-3 h-3 inline mr-1" />
                   Notes (Markdown)
               </label>
               <Textarea 
                   value={description} 
                   onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                       setDescription(e.target.value);
                       handleUpdate({ description: e.target.value });
                   }}
                   className="flex-1 resize-none h-[200px]"
                   placeholder="Add detailed notes here..."
               />
            </div>
        </div>
    </div>
  );
}
