import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon } from 'lucide-react';
import { useNavigate } from 'react-router';

export default function RecruitmentNotFound() {
  const navigate = useNavigate();
  return (
    <div style={{ textAlign: 'center', marginTop: '4rem' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Job Not Found</h2>
      <p style={{ marginBottom: '2rem' }}>
        The job requisition you are looking for does not exist or may have been
        removed.
      </p>
      <Button onClick={() => navigate('/dashboard/hr/recruitment')}>
        <ArrowLeftIcon style={{ marginRight: 8 }} />
        Back to Job List
      </Button>
    </div>
  );
}
