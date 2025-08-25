import { useState } from 'react';
import Header from '@/components/navigations/dashboard-header';
import Sidebar from '@/components/navigations/dashboard-sidebar';
import MobileSidebar from '@/components/navigations/mobile-dashboard-sidebar';
import { Outlet } from 'react-router';
import TopAlert from '@/components/dashboard/top-alert';

export default function DashboardLayout() {
  const [cancelNotification, setCancelNotification] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen flex-col">
      <Header
        onMobileMenuToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      />
      <div className="flex flex-1 overflow-hidden bg-[#F5F6FA]">
        <div className="fixed top-16 bottom-0 left-0 z-30 bg-white pt-6 max-md:hidden">
          <Sidebar />
        </div>
        <div className="ml-4 flex-1 overflow-y-auto md:ml-76">
          <div className="pt-4 pr-4">
            {!cancelNotification && (
              <TopAlert
                title={
                  'Lorem ipsum dolor sit amet consectetur. Auctor aliquet sem vulputate diam.'
                }
                onThumbsUp={() => console.log('Thumbs up clicked')}
                onThumbsDown={() => console.log('Thumbs down clicked')}
                onCancel={() => setCancelNotification(true)}
                externalLink="#"
              />
            )}
            <Outlet />
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />
    </div>
  );
}
