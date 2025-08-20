import Header from '@/components/navigations/dashboard-header';
import Sidebar from '@/components/navigations/dashboard-sidebar';
import { Outlet } from 'react-router';

export default function DashboardLayout() {
  return (
    <div>
      <Header />
      <div className="flex gap-4 bg-[#F5F6FA]">
        <Sidebar />
        <div className="w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
