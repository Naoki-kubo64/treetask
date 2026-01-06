'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NextActionList } from "./NextActionList";
import { PageManager } from "./PageManager";
import { TaskDetailPanel } from "./TaskDetailPanel";
import { ListTodo, StickyNote, Info } from "lucide-react";

export function SidePanel() {
  return (
    <div className="w-80 border-l bg-card/50 backdrop-blur-sm h-full flex flex-col shadow-xl z-10">
      <Tabs defaultValue="actions" className="w-full flex flex-col h-full">
        <div className="px-4 pt-4 shrink-0">
           <TabsList className="w-full grid grid-cols-3">
             <TabsTrigger value="actions" className="flex items-center gap-2">
               <ListTodo className="w-4 h-4" />
               <span className="hidden sm:inline">Act</span>
             </TabsTrigger>
             <TabsTrigger value="pages" className="flex items-center gap-2">
               <StickyNote className="w-4 h-4" />
               <span className="hidden sm:inline">Pages</span>
             </TabsTrigger>
             <TabsTrigger value="inspect" className="flex items-center gap-2">
               <Info className="w-4 h-4" />
               <span className="hidden sm:inline">Info</span>
             </TabsTrigger>
           </TabsList>
        </div>
        
        <TabsContent value="actions" className="flex-1 m-0 overflow-hidden">
           <NextActionList />
        </TabsContent>
        
        <TabsContent value="pages" className="flex-1 m-0 overflow-hidden">
           <PageManager />
        </TabsContent>

        <TabsContent value="inspect" className="flex-1 m-0 overflow-hidden">
           <TaskDetailPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
