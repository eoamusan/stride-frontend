import emptyInvoice from '@/assets/images/welcome.svg';
import { Button } from '@/components/ui/button';

export default function EmptyInvoice({ onClick }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <img src={emptyInvoice} className="size-[130px]" alt="No invoices" />
      <h2 className="mt-4 text-2xl font-bold">New Invoice</h2>
      <p className="mt-2 mb-4 text-sm text-[#7D7D7D]">
        Lorem ipsum dolor sit amet consectetur. Auctor aliquet sem vulputate
        diam.
      </p>
      <Button onClick={onClick} className={'h-10 w-full max-w-[298px]'}>
        Create Invoice
      </Button>
    </div>
  );
}
