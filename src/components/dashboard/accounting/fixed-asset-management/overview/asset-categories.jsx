import emptyStateImg from '@/assets/images/empty-chart-state.png';
import MaintenanceCard from './maintenance-card';
import { useState } from 'react';
import { Dot, Laptop } from 'lucide-react';

function CategoryItem() {
  return <div className='border rounded-lg py-3 px-6 flex items-center justify-between'>
    <div className='flex items-center gap-2'>
      <div className='text-primary'>
        <Laptop />
      </div>
      <div>
        <h6 className='font-semibold'>IT Equipment</h6>
        <div className='flex text-xs items-center text-gray-500'>
          <span>Straight Line</span>
          <span><Dot /></span>
          <span>2025-01-13</span>
        </div>
      </div>
    </div>
    <div>
      345 assets
    </div>
  </div>
}
export default function AssetCategories() {
  const [upcomingItems] = useState([])
  return (
    <div className="flex flex-col min-h-[300px] w-full p-6  bg-white rounded-2xl">
      <h2 className='font-semibold'>Asset Categories</h2>
      { upcomingItems.length ? <div className="flex items-center justify-center h-full">
        <img src={emptyStateImg} alt="Empty State" />
      </div> :
      <div className='flex flex-col gap-4 mt-4'>
        <CategoryItem />
        <CategoryItem />
        <CategoryItem />
      </div>
      }
    </div>
  );
}
