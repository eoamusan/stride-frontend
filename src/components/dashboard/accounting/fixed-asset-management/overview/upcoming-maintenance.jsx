import emptyStateImg from '@/assets/images/empty-chart-state.png';
import MaintenanceCard from './maintenance-card';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
export default function UpcomingMaintenance() {
  const [upcomingItems] = useState([])
  return (
    <Card className="w-full max-w-xs overflow-hidden p-4">
      <CardContent className={'px-0'}>
        <h2 className='font-semibold'>Upcoming Maintenance</h2>
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
      </CardContent>
    </Card>
  );
}
