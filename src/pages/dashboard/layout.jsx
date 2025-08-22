import { useState } from 'react';
import Header from '@/components/navigations/dashboard-header';
import Sidebar from '@/components/navigations/dashboard-sidebar';
import { Outlet } from 'react-router';
import TopAlert from '@/components/dashboard/top-alert';

export default function DashboardLayout() {
  const [cancelNotification, setCancelNotification] = useState(false);
  return (
    <div>
      <Header />
      <div className="flex gap-4 bg-[#F5F6FA]">
        <Sidebar />
        <div className="w-full pr-4 pt-4">
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
  );
}
