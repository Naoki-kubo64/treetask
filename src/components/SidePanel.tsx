'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NextActionList } from "./NextActionList";
import { TaskTypeManager } from "./TaskTypeManager";
import { ListTodo, Tag } from "lucide-react";

export function SidePanel() {
  return (
    <div className="w-80 border-l bg-card/50 backdrop-blur-sm h-full flex flex-col shadow-xl z-10">
      <Tabs defaultValue="actions" className="flex flex-col h-full">
        <div className="p-2 border-b">
           <TabsList className="w-full grid grid-cols-2">
             <TabsTrigger value="actions" className="flex items-center gap-2">
               <ListTodo className="w-4 h-4" />
               Actions
             </TabsTrigger>
             <TabsTrigger value="types" className="flex items-center gap-2">
               <Tag className="w-4 h-4" />
               Types
             </TabsTrigger>
           </TabsList>
        </div>
        
        <TabsContent value="actions" className="flex-1 m-0 overflow-hidden">
           <NextActionList />
        </TabsContent>
        
        <TabsContent value="types" className="flex-1 m-0 overflow-hidden">
           <TaskTypeManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
