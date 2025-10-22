import BusinessService from '@/api/business';
import SettingsForm from '@/components/dashboard/accounting/invoicing/settings/settings-form';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function InvoiceSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const res = await BusinessService.fetch();
        setSettings(res.data.data[0]);
      } catch (err) {
        toast.error(
          err.response?.data?.message ||
            err.message ||
            'Failed to load invoice settings. Please try again.'
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  return (
    <div className="my-4 min-h-screen">
      <div className="rounded-2xl bg-white p-4 md:p-8">
        <SettingsForm
          businessId={settings?._id}
          initialData={settings?.businessInvoiceSettings}
        />
      </div>
    </div>
  );
}
