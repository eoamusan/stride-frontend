import { useState } from 'react';
import EmptyDashboard from '@/components/dashboard/home/empty';
import OnboardModal from '@/components/dashboard/home/onboard-modal';

// sample url data
const projects = [];

export default function Home() {
  const [openOnboardingModal, setOpenOnboardingModal] = useState(false);
  return (
    <div className="mt-2 overflow-y-auto">
      <h1 className="p-4 text-base italic">
        WELCOME <span className="font-bold not-italic">Oluwatosin👋</span>
      </h1>
      <div>
        {projects.length === 0 ? (
          <EmptyDashboard onGetStarted={() => setOpenOnboardingModal(true)} />
        ) : (
          <div></div>
        )}
      </div>

      {/* Modals */}
      <OnboardModal
        open={openOnboardingModal}
        onClose={() => setOpenOnboardingModal(false)}
      />
    </div>
  );
}
