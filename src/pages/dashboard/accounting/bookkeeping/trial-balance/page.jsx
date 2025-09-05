import { Button } from '@/components/ui/button';

export default function TrialBalance() {
  return (
    <div className="my-4 min-h-screen">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <hgroup>
          <h1 className="text-2xl font-bold">Trial Balance</h1>
          <p className="text-sm text-[#7D7D7D]">
            Real-time account balance verification
          </p>
        </hgroup>

        <div className="flex space-x-4">
          <Button variant={'outline'} className={'h-10 rounded-2xl text-sm'}>
            Customize
          </Button>
          <Button className={'h-10 rounded-2xl text-sm'}>Save</Button>
        </div>
      </div>
    </div>
  );
}
