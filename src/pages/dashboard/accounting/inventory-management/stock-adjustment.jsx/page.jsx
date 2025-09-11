import { Button } from '@/components/ui/button';
import { DownloadIcon, PlusCircleIcon, SettingsIcon } from 'lucide-react';

export default function StockAdjustment() {
  return (
    <div className="my-4 min-h-screen">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <hgroup>
          <h1 className="text-2xl font-bold">Stock Adjustment</h1>
          <p className="text-sm text-[#7D7D7D]">
            Update inventory quantities and track stock changes
          </p>
        </hgroup>

        <div className="flex space-x-4">
          <Button
            onClick={() => setOpenAddProductForm(true)}
            className={'h-10 rounded-2xl text-sm'}
          >
            <PlusCircleIcon className="size-4" />
            Make Adjustment
          </Button>
          <Button size={'icon'} className={'size-10'} variant={'outline'}>
            <DownloadIcon size={16} />
          </Button>

          <Button size={'icon'} className={'size-10'} variant={'outline'}>
            <SettingsIcon size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
