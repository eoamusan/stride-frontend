import emptyVendor from '@/assets/images/welcome.svg';
import { Button } from '@/components/ui/button';

export default function EmptyTax({ onClick }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <img src={emptyVendor} className="size-[130px]" alt="No vendors" />
      <h2 className="mt-4 text-2xl font-bold"> Tax Management Setup</h2>
      <p className="mt-2 mb-4 text-sm text-[#7D7D7D]">
        Let’s use configure your tax management system in few simple steps
      </p>
      <Button onClick={onClick} className={'h-10 w-full max-w-[298px]'}>
        Get Started
      </Button>
    </div>
  );
}
