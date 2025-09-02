import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import EmptyInvoice from '@/components/dashboard/accounting/invoicing/empty-state';
import CreateInvoice from '@/components/dashboard/accounting/invoicing/create-invoice';

const invoice = [];

export default function Invoicing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [toggleCreateInvoice, setToggleCreateInvoice] = useState(false);

  // Check for create parameter on component mount
  useEffect(() => {
    const createParam = searchParams.get('create');
    if (createParam === 'true') {
      setToggleCreateInvoice(true);
    } else {
      setToggleCreateInvoice(false);
    }
  }, [searchParams]);

  const handleToggleCreateInvoice = () => {
    const newToggleState = !toggleCreateInvoice;
    setToggleCreateInvoice(newToggleState);

    // Update search params when toggleCreateInvoice changes
    if (newToggleState) {
      setSearchParams({ create: 'true' });
    } else {
      // Remove the create parameter when closing
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('create');
      setSearchParams(newSearchParams);
    }
  };

  if (toggleCreateInvoice) {
    return (
      <div className="my-4 min-h-screen">
        <CreateInvoice />
      </div>
    );
  }

  return (
    <div className="my-4 min-h-screen">
      <hgroup>
        <h1 className="text-2xl font-bold">Invoice Management</h1>
        <p className="text-sm text-[#7D7D7D]">
          Manage your accounts receivable
        </p>
      </hgroup>
      {invoice.length === 0 ? (
        <EmptyInvoice onClick={handleToggleCreateInvoice} />
      ) : (
        <div>Display invoices here</div>
      )}
    </div>
  );
}
