import emptyStateImg from '@/assets/images/empty-chart-state.png';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { BadgeDollarSign, Building } from 'lucide-react';

function Item(item) {
  const { name, dueDate, status, icon } = item
  const Icon = icon
  return (
    <div className='flex items-center justify-between'>
      <div className='flex gap-2 items-center'>
        <div className='w-6 h-6 bg-[#FFAE4C]/10 text-[#FFAE4C] rounded-full flex items-center justify-center'>
          { <Icon size={16} />}
        </div>
        <div className='flex flex-col'>
          <span className='text-sm font-medium text-[#434343]'>{name}</span>
          <span className='text-sm text-[#7D7D7D]'>Due: {dueDate}</span>
        </div>
      </div>
      <span className={`text-sm font-medium ${status === 'Pending' ? 'text-[#FFAE4C]' : 'text-[#24A959]'}`}>{status}</span>
    </div>
  )
}

export default function UpcomingDeadlines() {
  const [upcomingItems] = useState([])

  const items = [
    { name: 'VAT Return Filing', icon: Building, dueDate: '25th June 2024', status: 'Pending' },
    { name: 'Income Tax Payment', icon: BadgeDollarSign, dueDate: '30th June 2024', status: 'Completed' },
    { name: 'Quarterly Tax Report', icon: Building, dueDate: '5th July 2024', status: 'Pending' },
  ]

  return (
    <Card className="w-full overflow-hidden p-4">
      <CardContent className={'px-0'}>
        <h2 className='font-semibold'>Upcoming Deadlines</h2>
        <span className='text-sm text-[#7D7D7D]'>Next 30 days</span>
        { upcomingItems.length ? <div className="flex items-center justify-center h-full">
          <img src={emptyStateImg} alt="Empty State" />
        </div> :
        <div className='flex flex-col gap-4 mt-4 '>
          { items.map((item, index) => (
            <div className={cn(index !== items.length -1 && 'border-b pb-4')} key={index}>
              <Item key={index} name={item.name} dueDate={item.dueDate} status={item.status} icon={item.icon} />
            </div>
          ))}
        </div>
        }
      </CardContent>
    </Card>
  );
}
