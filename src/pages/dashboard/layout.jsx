import Sidebar from '@/components/navigations/dashboard-sidebar';
import { Outlet } from 'react-router';

export default function DashboardLayout() {
  return (
    <div>
      <header>This is the header</header>
      <div className="flex gap-4 bg-[#E8E8E8]">
        <Sidebar />
        <Outlet />
      </div>
    </div>
  );
}
