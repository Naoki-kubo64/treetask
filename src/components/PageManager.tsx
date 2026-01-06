'use client';

import { useState } from 'react';
import { useTaskStore } from '@/store/useTaskStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Check, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

export function PageManager() {
  const pages = useTaskStore((state) => state.pages);
  const activePageId = useTaskStore((state) => state.activePageId);
  const setActivePage = useTaskStore((state) => state.setActivePage);
  const addPage = useTaskStore((state) => state.addPage);
  const deletePage = useTaskStore((state) => state.deletePage);

  const [newPageName, setNewPageName] = useState('');

  const handleAddPage = () => {
    if (!newPageName.trim()) return;
    addPage(newPageName);
    setNewPageName('');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
         <h2 className="font-semibold text-lg">Pages</h2>
         <p className="text-xs text-muted-foreground mt-1">
           Manage your task trees.
         </p>
      </div>
      
      <ScrollArea className="flex-1 p-4">
         <div className="space-y-2">
           {pages.map((page) => (
             <div 
               key={page.id}
               className={cn(
                  "flex items-center justify-between p-2 rounded-md border transition-all cursor-pointer",
                  activePageId === page.id ? "bg-accent border-primary" : "hover:bg-muted"
               )}
               onClick={() => setActivePage(page.id)}
             >
                <div className="flex items-center gap-2">
                   <FileText className="w-4 h-4 text-muted-foreground" />
                   <span className="text-sm font-medium">{page.name}</span>
                </div>
                
                <div className="flex items-center gap-1">
                   {activePageId === page.id && <Check className="w-4 h-4 text-primary" />}
                   
                   {pages.length > 1 && (
                     <Button 
                       variant="ghost" 
                       size="icon" 
                       className="h-6 w-6 text-muted-foreground hover:text-destructive"
                       onClick={(e) => {
                          e.stopPropagation();
                          deletePage(page.id);
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
         <h4 className="text-xs font-medium text-muted-foreground">Add New Page</h4>
         <div className="flex gap-2">
            <Input 
               placeholder="Project Name..." 
               value={newPageName}
               onChange={(e) => setNewPageName(e.target.value)}
               className="h-8 text-sm"
            />
         </div>
         <Button onClick={handleAddPage} size="sm" className="w-full h-8" disabled={!newPageName}>
            <Plus className="w-3 h-3 mr-2" />
            Create Page
         </Button>
      </div>
    </div>
  );
}
