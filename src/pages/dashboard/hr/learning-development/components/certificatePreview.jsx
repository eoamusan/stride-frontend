import React from 'react';

import CertificateIcon from '@/assets/icons/certificate.svg';

const Certificate = ({ certificate }) => {
  const data = {
    name: certificate?.name || 'Femi Johnson',
    course: certificate?.course || 'Leadership Fundamentals',
    issueDate: certificate?.issueDate || 'Jan 15, 2025',
    validUntil: certificate?.validUntil || 'Jan 15, 2027',
    issuer: certificate?.issuer || 'OneDa HR Learning & Development',
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="relative flex aspect-[1/1] w-full flex-col items-center justify-between rounded-xl border border-purple-400 bg-[#EFEDFF4D] px-1 md:px-12 pt-6 md:pt-12 pb-6 text-center shadow-sm">
        <div className="mt-2 flex flex-col items-center gap-2">
          <img
            src={CertificateIcon}
            alt="certificate icon"
            className="h-20 w-20"
          />

          <h1 className="font-semibold tracking-tight text-gray-900 md:text-lg">
            Certificate of Completion
          </h1>

          <p className="text-sm text-gray-500">This certifies that</p>
        </div>

        <div className="flex w-full flex-col gap-8">
          <div className="space-y-1">
            <h2 className="text-lg md:text-2xl font-semibold text-gray-900 md:text-[32px]">
              {data.name}
            </h2>
            <p className="text-sm text-gray-500">has successfully completed</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg md:text-2xl font-semibold text-gray-900 md:text-[32px]">
              {data.course}
            </h3>
            <p className="mx-auto max-w-lg px-4 text-xs leading-relaxed text-gray-500 md:text-sm">
              This training program covered essential skills and knowledge
              required for professional excellence in the field.
            </p>
          </div>
        </div>

        <div className="mb-4 flex w-full flex-col gap-12">
          <div className="flex w-full items-center justify-around px-8">
            <div className="flex flex-col gap-1">
              <span className="tracking-widest text-gray-500 text-xs">
                Issue Date
              </span>
              <span className="text-xs font-bold text-gray-900">
                {data.issueDate}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs tracking-widest text-gray-500">
                Valid Until
              </span>
              <span className="text-xs font-bold text-gray-900">
                {data.validUntil}
              </span>
            </div>
          </div>

          <div className="md:mt-5 text-xs tracking-wide text-gray-500">
            {data.issuer}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificate;
