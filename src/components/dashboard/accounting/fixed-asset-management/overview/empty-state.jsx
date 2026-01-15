import emptyVendor from '@/assets/images/welcome.svg';
import { Button } from '@/components/ui/button';

export default function EmptyAsset({ onClick }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <img src={emptyVendor} className="size-[130px]" alt="No vendors" />
      <h2 className="mt-4 text-2xl font-bold">No Asset Yet!</h2>
      <p className="mt-2 mb-4 text-sm text-[#7D7D7D]">
        It looks like you haven’t added asset yet. 
      </p>
      <Button onClick={onClick} className={'h-10 w-full max-w-[298px]'}>
        Add Asset
      </Button>
    </div>
  );
}
