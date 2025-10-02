import { Button } from '@/components/ui/button';
import { DownloadIcon, PlusCircleIcon, SettingsIcon } from 'lucide-react';

export default function UserRoles() {
  return (
    <div className="my-4 min-h-screen">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <hgroup>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-sm text-[#7D7D7D]">
            Manage user accounts, roles, and permissions
          </p>
        </hgroup>

        <div className="flex space-x-4">
          <Button onClick={() => {}} className={'h-10 rounded-2xl text-sm'}>
            <PlusCircleIcon className="size-4" />
            Add User
          </Button>
          <Button size={'icon'} className={'size-10'} variant={'outline'}>
            <DownloadIcon size={16} />
          </Button>

          <Button size={'icon'} className={'size-10'} variant={'outline'}>
            <SettingsIcon size={16} />
          </Button>
        </div>
      </div>

      <div className="mt-10">
        
      </div>
    </div>
  );
}
