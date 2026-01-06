import { SidePanel } from '@/components/SidePanel';
import { TaskTreeCanvas } from '@/components/TaskTreeCanvas';

export default function Home() {
  return (
    <main className="flex h-screen w-full bg-background text-foreground overflow-hidden">
      {/* Sidebar - Tabs */}
      <SidePanel />

      {/* Main Canvas */}
      <div className="flex-1 relative">
        <TaskTreeCanvas />
        
      </div>
    </main>
  );
}
