import RunReportForm from '@/components/dashboard/accounting/bookkeeping/run-report-form';
import TrialBalanceCta from '@/components/dashboard/accounting/bookkeeping/trial-balance-cta';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Printer, Download, Share } from 'lucide-react';
import AccountService from '@/api/accounts';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import emptyStateImg from '@/assets/images/empty-chart-state.png';
import { useUserStore } from '@/stores/user-store';

export default function TrialBalance() {
  const activeBusiness = useUserStore((state) => state.activeBusiness);
  const [reportPeriod, setReportPeriod] = useState('empty');
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [accountingMethod, setAccountingMethod] = useState('accrual');
  const [openRunReportForm, setOpenRunReportForm] = useState(false);
  const [trialBalanceData, setTrialBalanceData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Function to print trial balance
  const handlePrint = () => {
    window.print();
  };

  // Function to fetch trial balance data
  const fetchTrialBalance = async () => {
    if (!fromDate || !toDate) {
      toast.error('Please select a date range');
      return;
    }

    try {
      setIsLoading(true);
      const response = await AccountService.fetchTransactions({
        businessId: true,
        trialBalance: true,
        startDate: fromDate.toISOString(),
        endDate: toDate.toISOString(),
      });

      // Transform the response data to match the table format
      const transformedData =
        response.data?.data?.map((item, index) => ({
          id: index + 1,
          accountCode: item.accountingAccountId?.accountCode || '-',
          accountName: item.accountingAccountId?.accountName || '-',
          type: item.accountingAccountId?.accountType || '-',
          debit: item.totalDebit || 0,
          credit: item.totalCredit || 0,
        })) || [];

      setTrialBalanceData(transformedData);

      if (transformedData.length === 0) {
        toast.error('No trial balance data found for the selected period');
      } else {
        toast.success('Trial balance loaded successfully');
      }
    } catch (error) {
      console.error('Error fetching trial balance:', error);
      toast.error('Failed to fetch trial balance data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #trial-balance-report,
          #trial-balance-report * {
            visibility: visible;
          }
          #trial-balance-report {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
      <div className="my-4 min-h-screen">
        <div className="flex flex-wrap items-center justify-between gap-6 print:hidden">
          <hgroup>
            <h1 className="text-2xl font-bold">Trial Balance</h1>
            <p className="text-sm text-[#7D7D7D]">
              Real-time account balance verification
            </p>
          </hgroup>

          <div className="flex space-x-4">
            <Button variant={'outline'} className={'h-10 rounded-2xl text-sm'}>
              Customize
            </Button>
            <Button className={'h-10 rounded-2xl text-sm'}>Save</Button>
          </div>
        </div>
        <div className="mt-10 print:hidden">
          <TrialBalanceCta
            reportPeriod={reportPeriod}
            onReportPeriodChange={setReportPeriod}
            fromDate={fromDate}
            onFromDateChange={setFromDate}
            toDate={toDate}
            onToDateChange={setToDate}
            accountingMethod={accountingMethod}
            onAccountingMethodChange={setAccountingMethod}
            onRunReport={fetchTrialBalance}
            onFilter={() => {}}
          />
        </div>

        {isLoading ? (
          <div className="mx-auto mt-10 flex h-64 max-w-2xl items-center justify-center">
            <div className="text-center text-gray-500">Loading...</div>
          </div>
        ) : trialBalanceData.length === 0 ? (
          <div className="mx-auto mt-10 max-w-2xl p-8">
            <div className="flex flex-col items-center justify-center py-12">
              <img
                src={emptyStateImg}
                alt="No data available"
                className="mb-4 h-40 w-auto"
              />
              <p className="text-center text-sm text-gray-500">
                {!fromDate || !toDate
                  ? 'Select a date range and click Run Report to view trial balance'
                  : 'No trial balance data found for the selected period'}
              </p>
            </div>
          </div>
        ) : (
          <div
            className="mx-auto mt-10 max-w-2xl rounded-lg border bg-white p-8 shadow-sm"
            id="trial-balance-report"
          >
            <div className="mb-4 flex items-center justify-between border-b pb-4 print:hidden">
              <button className="text-xs text-gray-500 hover:text-gray-700">
                Add notes
              </button>
              <div className="flex gap-4">
                <Printer
                  className="size-4 cursor-pointer text-[#254C00]"
                  onClick={handlePrint}
                />
                <Download className="size-4 cursor-pointer text-[#254C00]" />
                <Share className="size-4 cursor-pointer text-[#254C00]" />
              </div>
            </div>

            {/* Trial balance container */}
            <div className="mb-4 border-b pb-4 text-center">
              <h2 className="text-2xl font-normal text-[#434343]">
                {activeBusiness?.businessName || 'Your Business Name'}
              </h2>
              <h3 className="mt-2 text-base font-semibold text-[#434343]">
                Trial Balance
              </h3>
              <p className="mt-1 font-medium text-[#D3D3D3]">
                {format(fromDate, 'MMM d, yyyy')} -{' '}
                {format(toDate, 'MMM d, yyyy')}
              </p>
            </div>

            <div className="w-full">
              <div className="mb-4 grid grid-cols-12 border-b border-gray-200 pb-4">
                <div className="col-span-6"></div>
                <div className="col-span-3 text-right text-base">Debit</div>
                <div className="col-span-3 text-right text-base">Credit</div>
              </div>

              <div className="space-y-6">
                {trialBalanceData.map((item) => (
                  <div key={item.id} className="grid grid-cols-12 items-center">
                    <div className="col-span-6 text-base text-[#434343]">
                      {item.accountCode} {item.accountName}
                    </div>
                    <div className="col-span-3 text-right text-lg text-[#434343]">
                      {item.debit > 0
                        ? item.debit.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                          })
                        : '0.00'}
                    </div>
                    <div className="col-span-3 text-right text-lg text-[#434343]">
                      {item.credit > 0
                        ? item.credit.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                          })
                        : ''}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <RunReportForm
          isOpen={openRunReportForm}
          onClose={() => setOpenRunReportForm(false)}
          onSubmit={() => {}}
        />
      </div>
    </>
  );
}
