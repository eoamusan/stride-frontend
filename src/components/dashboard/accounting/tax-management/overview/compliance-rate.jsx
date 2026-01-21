import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import ProgressBar from '@/components/dashboard/accounting/shared/progress-bar';

function Item({ name, dueDate, status }) {
  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-col'>
        <span className='font-medium text-[#434343]'>{name}</span>
        <span className='text-sm text-[#7D7D7D]'>Due: {dueDate}</span>
      </div>
      <span className={`text-sm font-medium ${status === 'Pending' ? 'text-[#FFAE4C]' : 'text-[#24A959]'}`}>{status}</span>
    </div>
  )
}

export default function ComplianceRate() {

  return (
    <Card className="w-full overflow-hidden p-4">
      <CardContent className={'px-0'}>
        <h2 className='font-semibold'>Compliance Rate</h2>
        <span className='text-sm text-[#7D7D7D]'>Current tax compliance status</span>
        

        <div className='flex flex-col gap-1 mt-4 text-[#7D7D7D]'>
          <div className='text-xs flex justify-between'>
            <span>Overall Compliance</span>
            <span>75%</span>
          </div>
          <ProgressBar value={75} className='h-1' variant="success" />
          
        </div>
        <div className='flex justify-between mt-2 text-xs font-medium'>
            <div className='flex flex-col justify-center text-center'>
              <span className='text-[#434343]'>Filled</span>
              <span className='text-[#24A959]'>1</span>
            </div>
            <div className='flex flex-col text-center'>
              <span className='text-[#434343]'>Pending</span>
              <span className='text-[#FFAE4C]'>1</span>
            </div>
            <div className='flex flex-col text-center'>
              <span className='text-[#434343]'>Overdue</span>
              <span className='text-destructive'>1</span>
            </div>
          </div>

      </CardContent>
    </Card>
  );
}
