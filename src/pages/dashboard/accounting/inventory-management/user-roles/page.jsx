import { useEffect, useState } from 'react';
import Metrics from '@/components/dashboard/accounting/invoicing/plain-metrics';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DownloadIcon, PlusCircleIcon, SettingsIcon } from 'lucide-react';
import { useSearchParams } from 'react-router';
import RoleDefinitions from '@/components/dashboard/accounting/inventory/user-roles/role-definitions';
import UsersTracking from '@/components/dashboard/accounting/inventory/user-roles/users-tracking';
import AddUserForm from '@/components/dashboard/accounting/inventory/user-roles/add-user-form';
import SuccessModal from '@/components/dashboard/accounting/success-modal';

const usersMetrics = [
  { title: 'Total Users', value: '24' },
  { title: 'Active Users', value: '21' },
  { title: 'Admin Users', value: '8' },
  { title: 'Pending Invite', value: '8' },
];

export default function UserRoles() {
  const [openAddUserForm, setOpenAddUserForm] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('type') || 'user-activity';

  // Set default tab type in URL if not present
  useEffect(() => {
    if (!searchParams.get('type')) {
      setSearchParams({ type: 'user-activity' }, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const handleTabChange = (value) => {
    setSearchParams({ type: value });
  };

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
          <Button
            onClick={() => setOpenAddUserForm(true)}
            className={'h-10 rounded-2xl text-sm'}
          >
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

      <div className="mt-10 ml-1">
        <Select onValueChange={handleTabChange} value={currentTab}>
          <SelectTrigger className="w-full max-w-sm bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user-activity">
              User & Activity Tracking
            </SelectItem>
            <SelectItem value="role-definitions">Role Definitions</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-10">
        <Metrics metrics={usersMetrics} />
      </div>

      <div className="mt-10">
        {currentTab === 'user-activity' && <UsersTracking />}
        {currentTab === 'role-definitions' && <RoleDefinitions />}
      </div>

      <AddUserForm
        open={openAddUserForm}
        onOpenChange={setOpenAddUserForm}
        onSubmit={() => setOpenSuccessModal(true)}
      />
      <SuccessModal
        open={openSuccessModal}
        onOpenChange={setOpenSuccessModal}
        backText={'Back'}
        title={'User Added Successfully'}
        description={"You've successfully added a new user."}
      />
    </div>
  );
}
