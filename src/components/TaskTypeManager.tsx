'use client';

import { useState } from 'react';
import { useTaskStore } from '@/store/useTaskStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

export function TaskTypeManager() {
  const taskTypes = useTaskStore((state) => state.taskTypes);
  const activeTypeId = useTaskStore((state) => state.activeTypeId);
  const setActiveTypeId = useTaskStore((state) => state.setActiveTypeId);
  const addTaskType = useTaskStore((state) => state.addTaskType);
  const deleteTaskType = useTaskStore((state) => state.deleteTaskType);

  const [newTypeName, setNewTypeName] = useState('');
  const [newTypeColor, setNewTypeColor] = useState('#3b82f6'); // Default blue-500

  const handleAddType = () => {
    if (!newTypeName.trim()) return;
    const id = `type-${Date.now()}`;
    addTaskType({
        id,
        name: newTypeName,
        color: newTypeColor
    });
    setNewTypeName('');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
         <h2 className="font-semibold text-lg">Task Types</h2>
         <p className="text-xs text-muted-foreground mt-1">
           Manage categories and set the default for new tasks.
         </p>
      </div>
      
      <ScrollArea className="flex-1 p-4">
         <div className="space-y-2">
           {taskTypes.map((type) => (
             <div 
               key={type.id}
               className={cn(
                  "flex items-center justify-between p-2 rounded-md border transition-all cursor-pointer",
                  activeTypeId === type.id ? "bg-accent border-primary" : "hover:bg-muted"
               )}
               onClick={() => setActiveTypeId(type.id)}
             >
                <div className="flex items-center gap-2">
                   <div 
                     className="w-4 h-4 rounded-full border shadow-sm" 
                     style={{ backgroundColor: type.color }}
                   />
                   <span className="text-sm font-medium">{type.name}</span>
                </div>
                
                <div className="flex items-center gap-1">
                   {activeTypeId === type.id && <Check className="w-4 h-4 text-primary" />}
                   
                   {type.id !== 'default' && (
                     <Button 
                       variant="ghost" 
                       size="icon" 
                       className="h-6 w-6 text-muted-foreground hover:text-destructive"
                       onClick={(e) => {
                          e.stopPropagation();
                          deleteTaskType(type.id);
                       }}
                     >
                        <Trash2 className="w-3 h-3" />
                     </Button>
                   )}
                </div>
             </div>
           ))}
         </div>
      </ScrollArea>
      
      <div className="p-4 border-t bg-muted/20 space-y-2">
         <h4 className="text-xs font-medium text-muted-foreground">Add New Type</h4>
         <div className="flex gap-2">
            <Input 
               placeholder="Name..." 
               value={newTypeName}
               onChange={(e) => setNewTypeName(e.target.value)}
               className="h-8 text-sm"
            />
            <Input 
               type="color"
               value={newTypeColor}
               onChange={(e) => setNewTypeColor(e.target.value)}
               className="h-8 w-12 p-1 cursor-pointer"
            />
         </div>
         <Button onClick={handleAddType} size="sm" className="w-full h-8" disabled={!newTypeName}>
            <Plus className="w-3 h-3 mr-2" />
            Add Type
         </Button>
      </div>
    </div>
  );
}
