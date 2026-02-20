import { useState } from 'react';
import { CustomButton, SuccessModal } from '@/components/customs';
import { Textarea } from '@/components/ui/textarea';

const SuggestionModalContent = ({ suggestion, onClose }) => {
  const [hrResponse, setHrResponse] = useState(suggestion?.hrResponse || '');
  const [showSuccess, setShowSuccess] = useState(false);

  if (!suggestion) return null;

  const isResolved = suggestion.status?.toLowerCase() === 'resolved';

  const handleSubmit = () => {
    console.log('HR Response submitted:', {
      suggestionId: suggestion.id,
      hrResponse,
    });
    setShowSuccess(true);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    onClose?.();
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-base font-semibold text-gray-900">
          Suggestion Details
        </h3>

        <div className="rounded-xl border border-gray-200 bg-[#FAFAFA] px-5 py-4">
          <p className="text-sm leading-relaxed text-[#434343CC]">
            {suggestion.details || 'No details provided.'}
          </p>
        </div>

        <p className="text-sm text-[#434343]">
          Submitted by : {suggestion.author} on {suggestion.dateSubmitted}
        </p>
      </div>

      <div className="space-y-1">
        <h3 className="text-base font-semibold text-gray-900">HR Response</h3>
        {isResolved ? (
          <div className="rounded-xl border-l-4 border-l-purple-500 bg-[#EEF2FF] px-5 py-4">
            <p className="text-[13px] leading-relaxed text-[#374151]">
              {suggestion.hrResponse || 'No response provided.'}
            </p>
          </div>
        ) : (
          <Textarea
            placeholder="Provide feedback or updates on this suggestion"
            className="min-h-[100px] resize-none rounded-xl border-gray-100 bg-[#FAFAFA] px-5 py-4 placeholder:text-sm placeholder:text-gray-400 focus-visible:ring-blue-500"
            value={hrResponse}
            onChange={(e) => setHrResponse(e.target.value)}
          />
        )}
      </div>

      {!isResolved && (
        <div className="flex items-center justify-end gap-3 pt-2">
          <CustomButton type="button" variant="outline" onClick={onClose}>
            Cancel
          </CustomButton>
          <CustomButton onClick={handleSubmit}>Submit</CustomButton>
        </div>
      )}

      <SuccessModal
        open={showSuccess}
        onOpenChange={(open) => {
          if (!open) handleSuccessClose();
        }}
        title="Suggestion Resolved"
        description="You've Successfully Resolved a Suggestion"
        buttonText="Back"
        onAction={handleSuccessClose}
      />
    </div>
  );
};

export default SuggestionModalContent;
