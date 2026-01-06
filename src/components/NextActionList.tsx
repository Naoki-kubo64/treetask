'use client';

import { useTaskStore } from '@/store/useTaskStore';
import { findNextActions } from '@/lib/treeUtils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { CheckCircle2, Circle } from 'lucide-react';
import { useLocale } from '@/hooks/useLocale';

export function NextActionList() {
  const { t } = useLocale();
  const pages = useTaskStore((state) => state.pages);
  const activePageId = useTaskStore((state) => state.activePageId);
  const activePage = pages.find(p => p.id === activePageId);
  const nodes = activePage?.nodes || [];
  const edges = activePage?.edges || [];
  
  const toggleNodeStatus = useTaskStore((state) => state.toggleNodeStatus);

  const nextActions = findNextActions(nodes, edges);

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg flex items-center gap-2">
          {t.nextActions.title}
          <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {nextActions.length}
          </span>
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          {t.nextActions.subtitle}
        </p>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        {nextActions.length === 0 ? (
          <div className="text-center text-muted-foreground py-10">
            <p>{t.nextActions.empty}</p>
            <p className="text-xs mt-2">{t.nextActions.emptySub}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {nextActions.map((node) => (
              <div 
                key={node.id} 
                className="flex items-start gap-3 p-3 rounded-lg border bg-background hover:border-primary/50 transition-colors group"
              >
                <button
                  onClick={() => toggleNodeStatus(node.id)}
                  className="mt-0.5 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Circle className="w-4 h-4" />
                </button>
                <div>
                  <div className="text-sm font-medium">{node.data.label}</div>
                  {node.data.description && (
                    <div className="text-xs text-muted-foreground line-clamp-2">
                      {node.data.description}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
