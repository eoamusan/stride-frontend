import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import AccountService from '@/api/accounts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function AccountReport() {
  const location = useLocation();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const {
    accountIds,
    accountId,
    accountName,
    accountNumber,
    startDate,
    endDate,
    accountingMethod,
  } = location.state || {};

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const response = await AccountService.fetchTransactions({
        accountingAccountId: accountIds || [accountId],
        startDate: startDate ? new Date(startDate).toISOString() : undefined,
        endDate: endDate ? new Date(endDate).toISOString() : undefined,
      });

      console.log('Transactions response:', response);

      const data = response.data?.data?.transactions || [];
      setTransactions(data);

      if (data.length === 0) {
        toast.error('No records found');
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Failed to fetch transactions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!accountIds && !accountId) {
      toast.error('No account selected');
      navigate('/dashboard/accounting/bookkeeping/chart-of-accounts');
      return;
    }

    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountIds, accountId, startDate, endDate]);

  if (!accountIds && !accountId) {
    return null;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() =>
            navigate('/dashboard/accounting/bookkeeping/chart-of-accounts')
          }
        >
          ← Back to Chart of Accounts
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Report</CardTitle>
          <div className="text-muted-foreground space-y-1 text-sm">
            <p>
              <strong>Account:</strong> {accountName} ({accountNumber})
            </p>
            {startDate && endDate && (
              <p>
                <strong>Period:</strong>{' '}
                {format(new Date(startDate), 'MMM dd, yyyy')} -{' '}
                {format(new Date(endDate), 'MMM dd, yyyy')}
              </p>
            )}
            {accountingMethod && (
              <p>
                <strong>Method:</strong> {accountingMethod}
              </p>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <p>Loading transactions...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-muted-foreground p-8 text-center">
              <p>
                No transactions found for this account in the selected period.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="p-2 text-left">Date</th>
                    <th className="p-2 text-left">Description</th>
                    <th className="p-2 text-right">Debit</th>
                    <th className="p-2 text-right">Credit</th>
                    <th className="p-2 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction, index) => (
                    <tr key={index} className="hover:bg-muted/50 border-b">
                      <td className="p-2">
                        {transaction.date
                          ? format(new Date(transaction.date), 'MMM dd, yyyy')
                          : '-'}
                      </td>
                      <td className="p-2">{transaction.description || '-'}</td>
                      <td className="p-2 text-right">
                        {transaction.debit
                          ? `$${parseFloat(transaction.debit).toFixed(2)}`
                          : '-'}
                      </td>
                      <td className="p-2 text-right">
                        {transaction.credit
                          ? `$${parseFloat(transaction.credit).toFixed(2)}`
                          : '-'}
                      </td>
                      <td className="p-2 text-right">
                        {transaction.balance
                          ? `$${parseFloat(transaction.balance).toFixed(2)}`
                          : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
