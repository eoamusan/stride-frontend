import { format } from 'date-fns';

export default function PaymentPreview({
  payments = [],
  balanceDue = 0,
  currency = 'NGN',
  isLoading = false,
}) {
  return (
    <div className="space-y-6">
      <h3 className="text-sm font-semibold text-gray-900">Payment Made</h3>

      {/* Table Header */}
      <div className="rounded-lg bg-[#F5F3FF] p-4">
        <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-600">
          <div>Amount ({currency})</div>
          <div>Date Paid</div>
          <div>Method</div>
          <div>Date Created</div>
        </div>
      </div>

      {/* Payment Rows */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="py-8 text-center text-gray-500">
            Loading payments...
          </div>
        ) : payments.length > 0 ? (
          payments.map((payment, index) => (
            <div
              key={index}
              className="grid grid-cols-4 gap-4 border-b pb-4 text-sm last:border-b-0"
            >
              <div className="font-normal text-gray-900 pl-6">
                {payment.amount !== undefined
                  ? Number(payment.amount).toLocaleString()
                  : 'N/A'}
              </div>
              <div className="text-gray-900">
                {payment.datePaid
                  ? format(new Date(payment.datePaid), 'MMM-dd-yyyy')
                  : '-'}
              </div>
              <div className="text-gray-900">
                {payment.method || 'Bank Transfer'}
              </div>
              <div className="text-gray-900">
                {payment.dateCreated
                  ? format(new Date(payment.dateCreated), 'MMM-dd-yyyy')
                  : '-'}
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-gray-500">
            No payments made yet
          </div>
        )}
      </div>

      {/* Balance Due */}
      <div className="mt-6 flex items-center gap-4">
        <span className="text-sm font-semibold text-gray-900">Balance Due</span>
        <span className="text-sm font-bold text-gray-900">
          {Number(balanceDue).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      </div>
    </div>
  );
}
