import { useState } from 'react';
import Header from '@/components/navigations/dashboard-header';
import Sidebar from '@/components/navigations/dashboard-sidebar';
import MobileSidebar from '@/components/navigations/mobile-dashboard-sidebar';
import { Outlet, useSearchParams } from 'react-router';
import TopAlert from '@/components/dashboard/top-alert';
import Messaging from '@/components/dashboard/messaging/message';
import Chats from './chats/page';

export default function DashboardLayout() {
  const [cancelNotification, setCancelNotification] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchParams] = useSearchParams();

  const isChatPage = searchParams.get('chat') === 'fullpage';

  return (
    <div style={{ overscrollBehavior: 'none' }}>
      <div className="sticky top-0 z-50">
        <Header
          onMobileMenuToggle={() =>
            setIsMobileSidebarOpen(!isMobileSidebarOpen)
          }
        />
      </div>
      <div
        className="flex flex-1 overflow-hidden bg-[#F5F6FA]"
        style={{ overscrollBehavior: 'none' }}
      >
        <div
          className="fixed top-16 bottom-0 left-0 z-30 bg-white pt-6 max-lg:hidden"
          style={{ overscrollBehavior: 'none' }}
        >
          <Sidebar />
        </div>
        <div className="ml-4 flex-1 overflow-y-auto lg:ml-76">
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
            {isChatPage ? (
              <div className="relative h-full">
                <Chats />
              </div>
            ) : (
              <div
                className="relative h-full overflow-hidden px-4"
                style={{ overscrollBehavior: 'none' }}
              >
                <Outlet />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      <Messaging />
    </div>
  );
}
