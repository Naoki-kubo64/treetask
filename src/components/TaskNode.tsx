'use client';

import { Handle, NodeProps, Position, NodeResizer } from '@xyflow/react';
import { CheckCircle2, Circle } from 'lucide-react';
import { useTaskStore, TaskNode as TaskNodeType } from '@/store/useTaskStore';
import { cn } from '@/lib/utils'; // Shadcn util
import { motion } from 'framer-motion';

export function TaskNode({ id, data, selected }: NodeProps<TaskNodeType>) {
  const toggleNodeStatus = useTaskStore((state) => state.toggleNodeStatus);
  const taskTypes = useTaskStore((state) => state.taskTypes);
  
  const currentType = taskTypes.find(t => t.id === data.typeId) || taskTypes[0];
  const typeColor = currentType?.color || 'hsl(var(--primary))';
  
  const isCompleted = data.status === 'completed';

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "group relative min-w-[200px] h-full rounded-xl border bg-card px-4 py-3 shadow-sm transition-shadow",
        selected && "ring-2",
        isCompleted && "opacity-60 grayscale"
      )}
      style={{
          borderLeftColor: typeColor,
          borderLeftWidth: '4px',
          borderTopColor: selected ? typeColor : undefined,
          borderRightColor: selected ? typeColor : undefined,
          borderBottomColor: selected ? typeColor : undefined,
          '--tw-ring-color': typeColor 
      } as React.CSSProperties}
    >
      <NodeResizer 
         color={typeColor} 
         isVisible={selected} 
         minWidth={100} 
         minHeight={50} 
         handleStyle={{ width: 8, height: 8, borderRadius: 4 }}
      />
      <Handle type="target" position={Position.Left} className="!bg-muted-foreground/50 w-3 h-3" />
      
      <div className="flex items-center gap-3">
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent node selection?
            toggleNodeStatus(id);
          }}
          className="text-muted-foreground hover:text-primary transition-colors focus:outline-none"
        >
          {isCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          ) : (
            <Circle className="w-5 h-5" />
          )}
        </button>
        
        <div className="flex-1">
          <div className={cn("font-medium text-sm", isCompleted && "line-through text-muted-foreground")}>
            {data.label}
          </div>
          {data.description && (
             <div className="text-xs text-muted-foreground mt-0.5">{data.description}</div>
          )}
        </div>
      </div>

      <Handle type="source" position={Position.Right} className="!bg-muted-foreground/50 w-3 h-3" />
    </motion.div>
  );
}
