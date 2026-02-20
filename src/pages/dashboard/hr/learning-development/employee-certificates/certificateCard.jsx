import React from 'react';
import { CustomButton } from '@/components/customs';

const statusStyles = {
  active: {
    badge: 'bg-green-500 text-white',
    label: 'Active',
    days: 'text-emerald-600',
  },
  expiring: {
    badge: 'bg-amber-500 text-white',
    label: 'Expiring Soon',
    days: 'text-amber-600',
  },
  expired: {
    badge: 'bg-red-500 text-white',
    label: 'Expired',
    days: 'text-red-600',
  },
};

const CertificateCard = ({ certificate, onPreview, onDownload }) => {
  const styles = statusStyles[certificate.status] || statusStyles.active;
  const daysText =
    certificate.daysLeft < 0 ? '0 Days' : `${certificate.daysLeft} Days`;

  const handlePreview = (event) => {
    event.stopPropagation();
    onPreview?.(certificate);
  };

  const handleDownload = (event) => {
    event.stopPropagation();
    onDownload?.(certificate);
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="relative h-40 w-full overflow-hidden">
        <img
          src={certificate.image}
          alt={certificate.title}
          className="h-full w-full object-cover"
        />
        
        <span
          className={`absolute top-3 right-3 rounded-lg px-4 py-2 text-xs font-semibold ${styles.badge}`}
        >
          {styles.label}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-6 p-5">
        <h3 className="text-lg font-bold text-gray-600">
          {certificate.title}
        </h3>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span className='text-xs text-gray-800'>Issued:</span>
            <span className="text-sm text-gray-800 font-medium">{certificate.issued}</span>
          </div>

          <div className="flex justify-between">
            <span className='text-xs text-gray-800'>Expires:</span>
            <span className="text-sm text-gray-800 font-medium">{certificate.expires}</span>
          </div>

          <div className="flex justify-between">
            <span className='text-xs text-gray-800'>Days Left:</span>
            <span className={`text-sm font-semibold ${styles.days}`}>{daysText}</span>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-5">
          <CustomButton
            variant="outline"
            className="border-primary text-primary flex-1 rounded-xl py-6"
            onClick={handlePreview}
          >
            Preview
          </CustomButton>

          <CustomButton className="flex-1 rounded-xl py-6" onClick={handleDownload}>
            Download
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default CertificateCard;
