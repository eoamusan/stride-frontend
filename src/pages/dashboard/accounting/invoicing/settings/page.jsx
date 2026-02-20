import BusinessService from '@/api/business';
import SettingsForm from '@/components/dashboard/accounting/invoicing/settings/settings-form';
import { Skeleton } from '@/components/ui/skeleton';
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
        {isLoading ? (
          <div className="space-y-6">
            {/* Header skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-96" />
            </div>

            {/* Form sections skeleton */}
            <div className="space-y-8">
              {/* Basic Information */}
              <div className="space-y-4">
                <Skeleton className="h-6 w-32" />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              </div>

              {/* Logo section */}
              <div className="space-y-4">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-32 w-full max-w-xs" />
              </div>

              {/* Brand Color */}
              <div className="space-y-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-10 w-32" />
              </div>

              {/* Email Template */}
              <div className="space-y-4">
                <Skeleton className="h-6 w-36" />
                <Skeleton className="h-32 w-full" />
              </div>

              {/* Terms */}
              <div className="space-y-4">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-32 w-full" />
              </div>

              {/* Signature */}
              <div className="space-y-4">
                <Skeleton className="h-6 w-28" />
                <Skeleton className="h-32 w-full max-w-md" />
              </div>

              {/* Action buttons */}
              <div className="flex justify-end gap-4 pt-6">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </div>
        ) : (
          <SettingsForm
            businessId={settings?._id}
            initialData={settings?.businessInvoiceSettings}
          />
        )}
      </div>
    </div>
  );
}
