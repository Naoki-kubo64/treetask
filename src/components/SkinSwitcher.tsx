'use client';

import { skins, Skin } from '@/lib/skins';
import { useTaskStore } from '@/store/useTaskStore';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Palette } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function SkinSwitcher() {
  const currentSkin = useTaskStore((state) => state.skin);
  const setSkin = useTaskStore((state) => state.setSkin);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full shadow-md bg-background">
          <Palette className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2" align="end">
         <div className="space-y-1">
           <h4 className="font-medium text-sm px-2 py-1 mb-2">Select Skin</h4>
           {Object.entries(skins).map(([key, config]) => (
             <button
               key={key}
               onClick={() => setSkin(key as Skin)}
               className={cn(
                 "w-full text-left px-2 py-1.5 text-sm rounded-md transition-colors flex items-center justify-between",
                 currentSkin === key ? "bg-primary text-primary-foreground" : "hover:bg-muted"
               )}
             >
               {config.name}
               {currentSkin === key && <span className="text-xs opacity-70">Active</span>}
             </button>
           ))}
         </div>
      </PopoverContent>
    </Popover>
  );
}
