'use client';

import { useState } from 'react';
import { useTaskStore } from '@/store/useTaskStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Check, FileText, Download, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRef } from 'react';

export function PageManager() {
  const pages = useTaskStore((state) => state.pages);
  const activePageId = useTaskStore((state) => state.activePageId);
  const setActivePage = useTaskStore((state) => state.setActivePage);
  const addPage = useTaskStore((state) => state.addPage);
  const deletePage = useTaskStore((state) => state.deletePage);
  const importData = useTaskStore((state) => state.importData);

  const [newPageName, setNewPageName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddPage = () => {
    if (!newPageName.trim()) return;
    addPage(newPageName);
    setNewPageName('');
  };

  const handleExport = () => {
      const state = useTaskStore.getState();
      const data = {
          skin: state.skin,
          taskTypes: state.taskTypes,
          activeTypeId: state.activeTypeId,
          pages: state.pages,
          activePageId: state.activePageId
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `startree-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
          try {
              const data = JSON.parse(event.target?.result as string);
              // Basic validation could be done here
              if (data.pages && Array.isArray(data.pages)) {
                  importData(data);
              } else {
                  alert('Invalid data format');
              }
          } catch (err) {
              console.error(err);
              alert('Failed to parse JSON');
          }
      };
      reader.readAsText(file);
      // Reset input
      e.target.value = '';
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

      <div className="p-4 border-t bg-muted/20 flex gap-2">
         <Button variant="outline" size="sm" className="flex-1 h-8 text-xs" onClick={handleExport}>
             <Download className="w-3 h-3 mr-2" />
             Export
         </Button>
         <Button variant="outline" size="sm" className="flex-1 h-8 text-xs" onClick={() => fileInputRef.current?.click()}>
             <Upload className="w-3 h-3 mr-2" />
             Import
         </Button>
         <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept=".json" 
            onChange={handleImport} 
         />
      </div>
    </div>
  );
}
