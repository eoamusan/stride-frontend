import { Outlet } from 'react-router';

export default function DashboardLayout() {
  return (
    <div>
      <header>
        <h1>Dashboard</h1>
        <p>This is the dashboard page</p>
      </header>
      <Outlet />
    </div>
  );
}
