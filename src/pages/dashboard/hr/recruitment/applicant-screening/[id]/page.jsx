import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, BriefcaseIcon } from 'lucide-react';

export default function ApplicantDetails() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen overflow-scroll bg-gray-100 p-6">
      <div className="mx-auto max-w-full">
        {/* Main Content */}
        <main className="grid gap-6 md:gap-8 lg:grid-cols-3">
          {/* Header with back button and title */}
          <nav className="flex items-center gap-4 lg:col-span-3">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() =>
                navigate('/dashboard/hr/recruitment/applicant-screening')
              }
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Button>
            <p className="text-2xl font-bold text-gray-900">
              Applicant Details
            </p>
          </nav>
        </main>
      </div>
    </div>
  );
}
