import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from '@/components/dashboard/Sidebar';
import BottomNavigation from '@/components/mobile/BottomNavigation';
import { Button } from '@/design-system/components/Button';
import { Card } from '@/design-system/components/Card';
import { EmptyState } from '@/design-system/components/EmptyState';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log('[DASHBOARD] Authenticated user ID:', user?.id);

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-background">
      {/* LEFT SIDEBAR - Navigation (Desktop Only) */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      
      {/* CENTER WORKSPACE - Main Content */}
      <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
        {children}
      </main>
      
      {/* RIGHT PANEL - Quick Actions (Desktop Only) */}
      <aside className="hidden lg:block w-80 border-l border-border bg-surface p-6 overflow-y-auto">
        <div className="space-y-6">
          {/* Quick Actions */}
          <div>
            <h3 className="text-sm font-semibold text-primary mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button fullWidth size="md" variant="primary">
                Create New Report
              </Button>
              <Button fullWidth size="md" variant="secondary">
                Add Logbook Entry
              </Button>
              <Button fullWidth size="md" variant="secondary">
                Open AI Assistant
              </Button>
            </div>
          </div>

          {/* Recent Activity Summary */}
          <div>
            <h3 className="text-sm font-semibold text-primary mb-4">Recent Activity</h3>
            <Card className="rounded-xl p-4">
              <EmptyState
                icon="no_activity"
                title="No recent activity"
                description="Your activities will appear here"
              />
            </Card>
          </div>

          {/* AI Shortcuts */}
          <div>
            <h3 className="text-sm font-semibold text-primary mb-4">AI Shortcuts</h3>
            <div className="space-y-2">
              <Button fullWidth size="md" variant="secondary">
                Generate Chapter
              </Button>
              <Button fullWidth size="md" variant="secondary">
                Summarize Week
              </Button>
              <Button fullWidth size="md" variant="secondary">
                Analyze Images
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* BOTTOM NAVIGATION - Mobile Only */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
        <BottomNavigation />
      </div>
    </div>
  );
}
