import { SidePanel } from '@/components/SidePanel';
import { TaskTreeCanvas } from '@/components/TaskTreeCanvas';
import { SkinSwitcher } from '@/components/SkinSwitcher';

export default function Home() {
  return (
    <main className="flex h-screen w-full bg-background text-foreground overflow-hidden">
      {/* Sidebar - Tabs */}
      <SidePanel />

      {/* Main Canvas */}
      <div className="flex-1 relative">
        <TaskTreeCanvas />
        
        {/* Floating Controls */}
        <div className="absolute top-4 right-4 z-50">
          <SkinSwitcher />
        </div>
      </div>
    </main>
  );
}
