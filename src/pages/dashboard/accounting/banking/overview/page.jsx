import { useCallback, useMemo, useState } from 'react';
import Metrics from '@/components/dashboard/accounting/invoicing/plain-metrics';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { DownloadIcon, HousePlus, Landmark, PlusCircleIcon, SettingsIcon, UploadIcon } from 'lucide-react';
import { AppDialog } from '@/components/core/app-dialog';
import EmptyBank from '@/components/dashboard/accounting/banking/overview/empty-state';
import BankForm from '@/components/dashboard/accounting/banking/overview/bank-form';
import BankAccounts from '@/components/dashboard/accounting/banking/overview/bank-accounts';
import RecentActivity from '@/components/dashboard/accounting/banking/overview/recent-activity';
import ReconciliationActivity from '@/components/dashboard/accounting/banking/overview/reconciliation-activity';

// Mock data
const sampleData = [
  {
    id: 'INV-1001',
    date: 'Jan 2024-Dec 2024',
    customer: 'Acme Corp',
    amount: 50000,
    vatRate: '15%',
    vatAmount: 7500,
    total: 57500,
    status: 'Paid',
  },
  {
    id: 'INV-1002',
    date: 'Jan 2024-Dec 2024',
    customer: 'Beta LLC',
    amount: 30000,
    vatRate: '15%',
    vatAmount: 4500,
    total: 34500,
    status: 'Pending',
  },
]

export default function BankingOverview() {
  const [ openBankForm, setOpenBankForm ] = useState(false)
  const [bankData] = useState([...sampleData])

  const assetMetrics = useMemo(() => {
    return [
      {
        title: 'Total Bank Balance',
        value: 2000,
      },
      {
        title: 'Matched Transactions',
        value: 3000,
      },
      {
        title: 'Pending Reconciliation',
        value: 23,
      },
      {
        title: 'Discrepancies',
        value: 1000,
      },
    ]
  })

  const handleSetOpenBankForm = useCallback((value) => {
    setOpenBankForm(value)
  }, [])

  const handleOnCreateBank = useCallback((data) => {
    console.log('Bank created:', data)
  }, [])

  return (
    <div className='my-4 min-h-screen'>
    <div className={cn(!bankData.length && 'hidden')}>
      <div className="flex flex-wrap items-center justify-between gap-6">
        <hgroup>
          <h1 className="text-2xl font-bold">Overview</h1>
          <p className="text-sm text-[#7D7D7D]">
            Overview of your bank accounts, match transactions and reconcile statements
          </p>
        </hgroup>

        <div className="flex space-x-4">
          <Button
            className={'h-10 rounded-2xl text-sm'}
            variant="outline"
          >
            <UploadIcon className="size-4" />
            Upload Statement
          </Button>
          <Button
            onClick={() => setOpenBankForm(true)}
            className={'h-10 rounded-2xl text-sm'}
          >
            <PlusCircleIcon className="size-4" />
            Connect Bank
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
        <Metrics metrics={assetMetrics} />
      </div>
    </div>
    { !bankData.length ? <EmptyBank onClick={() => handleSetOpenBankForm(true)} /> : 
      <>
        <div className='mt-5 flex flex-col lg:flex-row gap-4 w-full'>
          <div className='w-full space-y-8'>
            <BankAccounts />
            <div className='grid lg:grid-cols-3 gap-4'>
              <div className='lg:col-span-2'>
                <RecentActivity />
              </div>
              <div className='lg:col-span-1'>
                <ReconciliationActivity />
              </div>
            </div>
          </div>
        </div>
      </>}
      <AppDialog 
        title="Connect Bank Account"
        description="Connect your bank account via secure API or upload a CSV statement "
        headerIcon={<Landmark />}
        open={openBankForm} 
        onOpenChange={setOpenBankForm}
        className='sm:max-w-163'
      >
        <BankForm onCreateBank={handleOnCreateBank} />
      </AppDialog>
    </div>
  );
}