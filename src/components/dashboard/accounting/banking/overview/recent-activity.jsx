import emptyStateImg from '@/assets/images/empty-chart-state.png';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, BadgeDollarSign, Building, Dot, Info, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

function Item(item) {
  const { description, category, time, arrowDirection } = item
  return (
    <div className='border border-[#F0EEFF] items-center space-y-4 justify-between rounded-2xl px-8 py-4'>

      <div className='flex gap-4 items-center'>
        <div className={cn("h-10 w-10 rounded-full flex items-center justify-center transform", arrowDirection === 'up' ? '-rotate-45 bg-[#6FD195]/10 text-[#6FD195]' : 'rotate-135 bg-[#FFAE4C]/10 text-[#FFAE4C]')}>
          <ArrowRight />
        </div>
        <div className='flex flex-col gap-1'>
          <span className='font-bold'>{description}</span>
          <div className='flex text-[#7D7D7D]'>{category} <Dot /> {time}</div>
        </div>
      </div>

    </div>
  )
}

export default function RecentActivity() {
  const [upcomingItems] = useState([])

  const items = [
    {
      description: 'Completed reconciliation for business checking',
      category: 'Reconciliation',
      time: '10 mins ago',
      arrowDirection: 'up',
    },
    {
      description: 'Matched 5 transactions from bank statement',
      category: 'Transaction Matching',
      time: '30 mins ago',
      arrowDirection: 'down',
    }
  ]

  return (
    <Card className="w-full overflow-hidden p-4">
      <CardContent className={'px-0'}>
        <div className='flex justify-between'>
          <div>
            <h2 className='font-semibold'>Recent Activity</h2>
          </div>
        </div>
        { upcomingItems.length ? <div className="flex items-center justify-center h-full">
          <img src={emptyStateImg} alt="Empty State" />
        </div> :
        <div className='grid grid-cols-1 gap-4 mt-4 '>
          { items.map((item, index) => (
            <div key={index}>
              <Item key={index} description={item.description} category={item.category} time={item.time} arrowDirection={item.arrowDirection} />
            </div>
          ))}
        </div>
        }
      </CardContent>
    </Card>
  );
}
