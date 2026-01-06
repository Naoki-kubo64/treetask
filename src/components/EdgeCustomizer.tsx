'use client';

import { useTaskStore } from '@/store/useTaskStore';
import { Button } from '@/components/ui/button';
import { Edge } from '@xyflow/react';
import { X, Minus, MoreHorizontal, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EdgeCustomizerProps {
  edgeId: string;
  onClose: () => void;
}

const COLORS = [
  { name: 'Gray', value: '#888' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Amber', value: '#f59e0b' },
];

const STYLES = [
  { name: 'Solid', value: '0' }, // strokeDasharray
  { name: 'Dashed', value: '5 5' },
  { name: 'Dotted', value: '2 2' },
];

export function EdgeCustomizer({ edgeId, onClose }: EdgeCustomizerProps) {
  const pages = useTaskStore((state) => state.pages);
  const activePageId = useTaskStore((state) => state.activePageId);
  const updateEdge = useTaskStore((state) => state.updateEdge);
  const onEdgesChange = useTaskStore((state) => state.onEdgesChange);
  
  const activePage = pages.find(p => p.id === activePageId);
  const edge = activePage?.edges.find(e => e.id === edgeId);

  if (!edge) return null;

  const currentStroke = edge.style?.stroke || '#888';
  const currentDash = edge.style?.strokeDasharray || '0';

  const handleColorChange = (color: string) => {
    updateEdge(edgeId, { style: { ...edge.style, stroke: color } });
  };

  const handleStyleChange = (dash: string) => {
    updateEdge(edgeId, { style: { ...edge.style, strokeDasharray: dash } });
  };

  const handleDelete = () => {
      onEdgesChange([{ id: edgeId, type: 'remove' }]);
      onClose();
  };

  return (
    <div className="absolute top-4 right-16 z-50 bg-card border shadow-xl rounded-lg p-3 w-64 animate-in fade-in zoom-in-95 duration-200">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Edge Style</h4>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
          <X className="w-3 h-3" />
        </Button>
      </div>

      <div className="space-y-3">
        <div>
           <div className="text-xs mb-1.5 font-medium">Color</div>
           <div className="flex flex-wrap gap-1.5">
             {COLORS.map((c) => (
               <button
                 key={c.value}
                 className={cn(
                   "w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 focus:outline-none",
                   currentStroke === c.value ? "border-primary ring-1 ring-offset-1 ring-primary" : "border-transparent"
                 )}
                 style={{ backgroundColor: c.value }}
                 onClick={() => handleColorChange(c.value)}
                 title={c.name}
               />
             ))}
           </div>
        </div>

        <div>
           <div className="text-xs mb-1.5 font-medium">Line Type</div>
           <div className="flex gap-1">
             {STYLES.map((s) => (
                <button
                  key={s.name}
                  className={cn(
                    "flex-1 h-8 rounded border flex items-center justify-center hover:bg-muted transition-colors",
                    currentDash === s.value ? "bg-accent border-primary" : "bg-card"
                  )}
                  onClick={() => handleStyleChange(s.value)}
                  title={s.name}
                >
                   {/* Visual representation of line style */}
                   <svg width="24" height="2" viewBox="0 0 24 2" className="overflow-visible">
                      <line 
                        x1="0" y1="1" x2="24" y2="1" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeDasharray={s.value === '0' ? undefined : s.value}
                      />
                   </svg>
                </button>
             ))}
           </div>
        </div>

        <div className="pt-2 border-t">
            <Button 
                variant="destructive" 
                size="sm" 
                className="w-full h-8 flex items-center justify-center gap-2"
                onClick={handleDelete}
            >
                <Trash2 className="w-3 h-3" />
                Delete Connection
            </Button>
        </div>
      </div>
    </div>
  );
}
