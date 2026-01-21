import emptyStateImg from '@/assets/images/empty-chart-state.png';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import kudaLogo from '@/assets/images/kuda.png';
import { BadgeDollarSign, Building, Info, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

function Item(item) {
  const { id, balance, bank, accountNumber, time, status, category, unmatchedTransactions } = item
  return (
    <div className='border border-[#F0EEFF] items-center space-y-4 justify-between rounded-2xl px-8 py-4'>

      <div className='flex justify-between'>
        <div className='flex items-center gap-2'>
          <img src={kudaLogo} alt="Bank Logo" className='max-h-10 rounded-md mb-2' />
          <div className='flex flex-col mr-4 text-sm text-[#7D7D7D]'>
            <span>{id}</span>
            <span className='font-bold text-[#434343]'>{category}</span>
            <span>{bank}</span>
          </div>
        </div>
        <div>
          <Badge variant="success">{status}</Badge>
        </div>
      </div>

      <div className='flex flex-col'>
        <span className='text-sm font-bold text-[#434343]'>Balance</span>
        <span className='text-sm text-[#7D7D7D] font-semibold'>{balance}</span>
      </div>

      <div className='flex justify-between text-sm text-[#7D7D7D]'>
        <span className=' font-semibold'>{accountNumber}</span>
        <div className='flex gap-4 items-center'>
          <RefreshCcw size={16} />
          <span>{time}</span>
        </div>
      </div>

      <div className='flex text-sm border border-[#FFAE4C] items-center gap-4 rounded-2xl p-4'>
        <span className='text-[#FFAE4C]'><Info size={16} /></span>
        <span className='text-[#A86616] font-semibold'>{unmatchedTransactions} unmatched transactions</span>
      </div>

      <div className='flex justify-between mt-8'>
        <Button className='rounded-2xl' size="lg">
          Details
        </Button>
        <Button variant="ghost" className='rounded-2xl' size="lg">
          Reconcile
        </Button>
      </div>
    </div>
  )
}

export default function BankAccounts() {
  const [upcomingItems] = useState([])

  const items = [
    { id: 'Kuda Bank', balance: '₦250,000.00', bank: 'Kuda Bank PLC', accountNumber: '1234567890', time: '2 hours ago', status: 'Active', category: 'Savings Account', unmatchedTransactions: 5 },
    { id: 'GTBank', balance: '₦1,500,000.00', bank: 'Guaranty Trust Bank', accountNumber: '0987654321', time: '30 minutes ago', status: 'Active', category: 'Current Account', unmatchedTransactions: 2 },
    { id: 'Access Bank', balance: '₦750,000.00', bank: 'Access Bank PLC', accountNumber: '1122334455', time: '1 hour ago', status: 'Inactive', category: 'Savings Account', unmatchedTransactions: 0 },
  ]

  return (
    <Card className="w-full overflow-hidden p-4">
      <CardContent className={'px-0'}>
        <div className='flex justify-between'>
          <div>
            <h2 className='font-semibold'>Bank Accounts</h2>
            <span className='text-sm text-[#7D7D7D]'>Connected accounts and their current balances</span>
          </div>
          <div>
            <Button variant='outline' size='sm' className='rounded-2xl text-sm'>
              View all
            </Button>
          </div>
        </div>
        { upcomingItems.length ? <div className="flex items-center justify-center h-full">
          <img src={emptyStateImg} alt="Empty State" />
        </div> :
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:flex-row gap-4 mt-4 '>
          { items.map((item, index) => (
            <div key={index}>
              <Item key={index} id={item.id} balance={item.balance} bank={item.bank} accountNumber={item.accountNumber} time={item.time} status={item.status} category={item.category} unmatchedTransactions={item.unmatchedTransactions} />
            </div>
          ))}
        </div>
        }
      </CardContent>
    </Card>
  );
}
