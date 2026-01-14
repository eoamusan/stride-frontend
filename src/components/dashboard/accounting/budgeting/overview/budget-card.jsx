import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dot, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { useEffect } from 'react'

const BudgetCard = ({ isSelected, handleSelect, data}) => {
  
  useEffect(() => {
    console.log(data)
  }, [data])

  return (
    <Card className="w-full p-4">
      <CardContent className={'px-0'}>
        <div className='flex gap-4 items-center my-4'>
          <Checkbox checked={isSelected} onCheckedChange={handleSelect} />
          <div className='flex flex-col'>
            <h1 className='font-medium text-lg'>{ data.id }</h1>
            <span className='text-gray-600 flex'>{ data.type } <Dot /> Finance</span>
          </div>
        </div>
        
        <div className='flex flex-col gap-2 mb-4'>
          <div className='grid grid-cols-2'>
            <span className='text-gray-600 font-medium'>Name</span>
            <span className='font-medium'>{ data.name }</span>
          </div>
          <div className='grid grid-cols-2'>
            <span className='text-gray-600 font-medium'>Type</span>
            <span className='font-medium'>{ data.type }</span>
          </div>
          <div className='grid grid-cols-2'>
            <span className='text-gray-600 font-medium'>Date</span>
            <span className='font-medium'>{ data.date }</span>
          </div>
          <div className='grid grid-cols-2'>
            <span className='text-gray-600 font-medium'>Last Modified By</span>
            <span className='font-medium'>{ data.lastModifiedBy }</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetCard;
