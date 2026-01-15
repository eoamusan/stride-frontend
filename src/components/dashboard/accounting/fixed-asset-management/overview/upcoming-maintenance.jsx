import emptyStateImg from '@/assets/images/empty-chart-state.png';
import MaintenanceCard from './maintenance-card';
import { useState } from 'react';
export default function UpcomingMaintenance() {
  const [upcomingItems] = useState([])
  return (
    <div className="flex flex-col min-h-[300px] w-full p-6  bg-white rounded-2xl">
      <h2 className='font-medium'>Upcoming Maintenance</h2>
      { upcomingItems.length ? <div className="flex items-center justify-center h-full">
        <img src={emptyStateImg} alt="Empty State" />
      </div> :
      <div className='flex flex-col gap-4 mt-4'>
        <MaintenanceCard title="HVAC System Inspection" description="Due: Tomorrow • Building A" status='Overdue' variant='danger' />
        <MaintenanceCard title="HVAC System Inspection" description="Due: Tomorrow • Building A" status='Overdue' variant='warn' />
        <MaintenanceCard title="HVAC System Inspection" description="Due: Tomorrow • Building A" status='Scheduled' variant='info' />
        <MaintenanceCard title="HVAC System Inspection" description="Due: Tomorrow • Building A" status='Overdue' variant='danger' />
        <MaintenanceCard title="HVAC System Inspection" description="Due: Tomorrow • Building A" status='Overdue' variant='danger' />
      </div>
      }
    </div>
  );
}
