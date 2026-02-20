import { CheckCircle, Pencil, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

export default function PreviewForm({
  formData,
  handleFinalSubmit,
  isSubmitting,
  setIsPreview,
}) {
  return (
    <div className="flex items-center justify-center">
      <div className="w-full">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">
          Preview Requisition
        </h2>

        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <tbody className="divide-y divide-gray-200 bg-white">
              <tr>
                <td className="w-1/3 px-6 py-4 text-sm font-medium text-gray-500">
                  Job Title
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {formData.jobTitle || '-'}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-gray-500">
                  Department
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 capitalize">
                  {formData.department || '-'}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-gray-500">
                  Employment Type
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {formData.employmentType || '-'}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-gray-500">
                  Cadre
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 capitalize">
                  {formData.grade || '-'}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-gray-500">
                  Budget Range
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {formData.minBudget.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} -{' '}
                  {formData.maxBudget.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-gray-500">
                  Number of Openings
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {formData.noOfOpenings}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-gray-500">
                  Urgency
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {formData.urgency || '-'}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-gray-500">
                  Expected Start Date
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {formData.startDate ? format(formData.startDate, 'PPP') : '-'}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-gray-500">
                  Reason for Hire
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {formData.reason || '-'}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-gray-500">
                  Detailed Reason
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {formData.detailedReason || '-'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => setIsPreview(false)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            <Pencil className="h-4 w-4" />
            Back to Edit
          </button>
          <button
            type="button"
            onClick={handleFinalSubmit}
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#3b07bb] py-3 font-medium text-white shadow-sm transition-colors hover:bg-[#2f0596] disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle className="h-4 w-4" />
            )}
            {isSubmitting ? 'Submitting...' : 'Submit Requisition'}
          </button>
        </div>
      </div>
    </div>
  );
}
