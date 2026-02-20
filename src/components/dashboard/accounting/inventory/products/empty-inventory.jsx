import emptyInventory from '@/assets/images/welcome.svg';
import { Button } from '@/components/ui/button';

export default function EmptyInventory({ onClick }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <img src={emptyInventory} className="size-[130px]" alt="No inventory" />
      <h2 className="mt-4 text-2xl font-bold">No Inventory yet!</h2>
      <p className="mt-2 mb-4 text-sm text-[#7D7D7D]">
        It looks like you haven’t added inventory yet.
      </p>
      <Button onClick={onClick} className={'h-10 w-full max-w-[298px]'}>
        Create Inventory
      </Button>
    </div>
  );
}
