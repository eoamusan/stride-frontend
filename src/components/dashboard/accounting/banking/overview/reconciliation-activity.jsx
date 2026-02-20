import { Card, CardContent } from '@/components/ui/card';
import ProgressBar from '../../shared/progress-bar';
import { Button } from '@/components/ui/button';

export default function ReconciliationActivity() {


  return (
    <Card className="w-full overflow-hidden p-4">
      <CardContent className={'px-0'}>
        <div className='flex justify-between'>
          <div>
            <h2 className='font-semibold'>This Month</h2>
          </div>
        </div>

        <div>
          <div className='mt-4 flex justify-between gap-4 mb-1 text-[#7D7D7D]'>
            <div>Reconciliation Progress</div>
            <span>75%</span>
          </div>
          <ProgressBar value={75} variant="success" className="h-1.5" />
        </div>

        <div className='flex flex-col gap-2 mt-4 text-[#434343]'>
          <div className='flex justify-between'>
            <span>Total Transactions</span>
            <span>1456</span>
          </div>
          <div className='flex justify-between'>
            <span>Auto-Matched</span>
            <span className='text-[#24A959]'>1354</span>
          </div>
          <div className='flex justify-between'>
            <span>Manual Review</span>
            <span className='text-[#FFAE4C]'>26</span>
          </div>
          <div className='flex justify-between'>
            <span>Discrepancies</span>
            <span className='text-destructive'>2</span>
          </div>
        </div>

        <div>
          <Button className='w-full mt-6 rounded-2xl'>
            Start Reconciliation
          </Button>
        </div>
        
      </CardContent>
    </Card>
  );
}
