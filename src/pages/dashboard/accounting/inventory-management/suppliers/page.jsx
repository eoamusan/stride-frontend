import ContactSupplierForm from '@/components/dashboard/accounting/inventory/suppliers/contact-supplier-form';
import SuppliersList from '@/components/dashboard/accounting/inventory/suppliers/supplier-list';
import Metrics from '@/components/dashboard/accounting/invoicing/plain-metrics';
import SuccessModal from '@/components/dashboard/accounting/success-modal';
import { Button } from '@/components/ui/button';
import { DownloadIcon, SettingsIcon } from 'lucide-react';
import { useState } from 'react';

const supplierMetrics = [
  {
    title: 'Total Suppliers',
    value: '24',
  },
  {
    title: 'Active Suppliers',
    value: '21',
  },
  {
    title: 'Pending Orders',
    value: '8',
  },
  {
    title: 'Monthly Spend',
    value: '$45,230',
  },
];

export default function Suppliers() {
  const [openContactForm, setOpenContactForm] = useState({
    open: false,
    supplier: {},
  });
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  return (
    <div className="my-4 min-h-screen">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <hgroup>
          <h1 className="text-2xl font-bold">Suppliers</h1>
          <p className="text-sm text-[#7D7D7D]">
            Manage vendor relationships and purchase orders
          </p>
        </hgroup>

        <div className="flex space-x-4">
          <Button onClick={() => {}} className={'h-10 rounded-2xl text-sm'}>
            Add Supplier
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
        <Metrics metrics={supplierMetrics} />
        <SuppliersList
          className={'mt-10'}
          openContactForm={(supplier) =>
            setOpenContactForm({ open: true, supplier })
          }
        />
      </div>

      <ContactSupplierForm
        open={openContactForm.open}
        onOpenChange={(open, supplier) =>
          setOpenContactForm({ open, supplier })
        }
        supplierData={openContactForm?.supplier}
        openSuccessModal={setOpenSuccessModal}
      />

      <SuccessModal
        open={openSuccessModal}
        onOpenChange={setOpenSuccessModal}
        backText={'Back'}
        title={'Message Sent'}
        description={"You've successfully sent a message "}
      />
    </div>
  );
}
