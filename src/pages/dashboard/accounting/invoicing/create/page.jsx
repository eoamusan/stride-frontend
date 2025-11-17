import CreateInvoice from '@/components/dashboard/accounting/invoicing/create-invoice';
import { useUserStore } from '@/stores/user-store';
import { useNavigate, useSearchParams } from 'react-router';

export default function CreateInvoicePage() {
  const { businessData } = useUserStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const invoiceType = searchParams.get('type') || 'regular';

  const handleBack = () => {
    navigate('/dashboard/accounting/invoicing');
  };

  return (
    <div className="my-4 min-h-screen">
      <CreateInvoice
        businessId={businessData?._id}
        onBack={handleBack}
        invoiceType={invoiceType}
      />
    </div>
  );
}
