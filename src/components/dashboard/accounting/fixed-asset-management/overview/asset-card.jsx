import assetImage from '@/assets/images/asset-1.png';
import { Checkbox } from '@/components/ui/checkbox';
import { useEffect } from 'react'
import ProgressBar from '@/components/dashboard/accounting/shared/progress-bar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { MoreVerticalIcon, User } from 'lucide-react';
import AppDropdownMenu from '@/components/dashboard/accounting/shared/app-dropdown-menu';

const AssetCard = ({ isSelected, handleSelect, data}) => {

  const dropdownActions = [
    { key: 'edit', label: 'Edit Asset' },
    { key: 'delete', label: 'Delete Asset' },
  ];

  const handleDropdownAction = (actionKey, item) => {
    switch (actionKey) {
      case 'edit':
        // Handle edit action
        console.log('Edit action for', item);
        break;
      case 'delete':
        // Handle delete action
        console.log('Delete action for', item);
        break;
      default:
        break;
    }
  }
  
  useEffect(() => {
    console.log(data)
  }, [data])

  return (
    <Card className="w-full p-4">
      <CardContent className={'px-0'}>
        <div className='flex flex-col gap-4 justify-between'>
          <div className='flex items-center justify-between'>
            <Checkbox checked={isSelected} onCheckedChange={handleSelect} />
            <Badge variant='success'>In Use</Badge>
          </div>
          <div className='flex flex-col items-center gap-2'>
            <img src={assetImage} alt="asset image" className='w-full h-45 rounded-md object-cover' />
          </div>
        </div>
        
        <div className='flex flex-col gap-2 mb-4 text-sm mt-1'>
          <div className='grid grid-cols-2'>
            <span className='font-semibold'>Ikeja Building</span>
            <span className='flex flex-col text-lg items-end font-medium text-right'>
              { data.budgetAmount }
              <div className='w-17'>
                <ProgressBar variant={data.variance > 50 ? 'success' : 'danger'} value={data.variance} />
              </div>
            </span>
          </div>
          <div className='text-gray-400'>
            <div className='grid grid-cols-2'>
              <span className='text-sm font-semibold'>MBP2024001</span>
              <span className='font-medium text-right'>Sales Team</span>
            </div>
            <div className='grid grid-cols-2'>
              <span className='text-sm font-semibold'>Building</span>
            </div>
          </div>
          <div className='flex items-center gap-2 my-1'>
            <Avatar className="h-4 w-4">
              <AvatarImage
                src={data.user}
                className={'size-4'}
              />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <span className='text-gray-400 font-semibold'>Seun Oye</span>
          </div>
          <div className='flex gap-2 justify-between'>
            <div className='grow'>
              <Button className='w-full rounded-2xl'>View Details</Button>
            </div>
            <AppDropdownMenu dropdownActions={dropdownActions} handleDropdownAction={handleDropdownAction} data={data} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssetCard;
