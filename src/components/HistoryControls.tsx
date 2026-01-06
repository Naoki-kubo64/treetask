'use client';

import { Button } from '@/components/ui/button';
import { useTaskStore } from '@/store/useTaskStore';
import { Undo2, Redo2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export function HistoryControls() {
  // Access the temporal store from zundo
  const useStore = useTaskStore as any;
  const { undo, redo, pastStates, futureStates } = useStore.temporal.getState();
  
  // Force re-render on history change
  // zundo doesn't automatically trigger re-renders for temporal state efficiently in all setups without specific selectors
  // But we can subscribe
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  useEffect(() => {
      const unsubscribe = useStore.temporal.subscribe((state: any) => {
          setCanUndo(state.pastStates.length > 0);
          setCanRedo(state.futureStates.length > 0);
      });
      return unsubscribe;
  }, [useStore]);

  return (
    <div className="flex items-center gap-1 bg-card/80 backdrop-blur p-1 rounded-lg border shadow-sm">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => undo()}
        disabled={!canUndo}
        title="Undo (Ctrl+Z)"
      >
        <Undo2 className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => redo()}
        disabled={!canRedo}
        title="Redo (Ctrl+Y)"
      >
        <Redo2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
