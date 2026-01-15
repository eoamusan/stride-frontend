import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from "@/components/ui/progress"
import { Checkbox } from '@/components/ui/checkbox';
import { useEffect } from 'react'
import { Dot } from 'lucide-react';
import { cn } from '@/lib/utils';

const AssetCard = ({ isSelected, handleSelect, data}) => {
  
  useEffect(() => {
    console.log(data)
  }, [data])

  return (
    <Card className="w-full p-4">
      <CardContent className={'px-0'}>
        <div className='flex gap-4 items-center justify-between my-4'>
          <div className='flex items-center gap-2'>
            <Checkbox checked={isSelected} onCheckedChange={handleSelect} />
            <div className='flex flex-col'>
              <h1 className='font-medium'>{ data.id }</h1>
              <span className='text-gray-600 text-sm flex items-center'>{ data.type } <Dot /> Finance</span>
            </div>
          </div>
          <Badge className="bg-[#254C00]/10 text-[#254C00]">{ data.status }</Badge>
        </div>
        
        <div className='flex flex-col gap-2 mb-4 text-sm'>
          <div className='grid grid-cols-2'>
            <span className='text-gray-600 font-medium'>Budget Amount</span>
            <span className='font-medium text-right'>{ data.budgetAmount }</span>
          </div>
          <div className='grid grid-cols-2'>
            <span className='text-gray-600 font-medium'>Actual Amount</span>
            <span className='font-medium text-right'>{ data.actualAmount }</span>
          </div>
          <div className='grid grid-cols-1'>
            <div className='flex justify-between'>
              <span className='text-gray-600 font-medium'>Variance</span>
              <span className={cn('font-bold', data.variance > 50 ? 'text-[#254C00]':'text-[#CF0505]')}>{ data.variance }%</span>
            </div>
            <Progress value={data.variance} className='bg-[#D3D3D3]' indicatorClassName={cn(data.variance > 50 ? 'bg-[#254C00]' : 'bg-[#CF0505]')} />
          </div>
          <div className='grid grid-cols-2'>
            <span className='text-gray-600 font-medium'>Modified By</span>
            <span className='font-medium text-right'>{ data.lastModifiedBy }</span>
          </div>
          <div className='grid grid-cols-2'>
            <span className='text-gray-600 font-medium'>Date</span>
            <span className='font-medium text-right'>{ data.date }</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssetCard;
