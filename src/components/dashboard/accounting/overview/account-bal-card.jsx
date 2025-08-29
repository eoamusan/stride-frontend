import { Card } from '@/components/ui/card';
import checkingImg from '@/assets/icons/checking-acct.svg';
import creditCardImg from '@/assets/icons/credit-card.svg';
import investmentImg from '@/assets/icons/investment-acct.svg';
import savingsImg from '@/assets/icons/savings-acct.svg';
import emptyStateImg from '@/assets/images/empty-chart-state.png';

const data = [
  {
    name: 'Primary Checking',
    type: 'Checking Account',
    balance: '$453',
    analytics: {
      percentage: '+12.5%',
      duration: 'this month',
    },
  },
  {
    name: 'Business Savings',
    type: 'Savings Account',
    balance: '$453',
    analytics: {
      percentage: '+12.5%',
      duration: 'this month',
    },
  },
  {
    name: 'Business Credit Card',
    type: 'Credit Card',
    balance: '$453',
    analytics: {
      percentage: '+12.5%',
      duration: 'this month',
    },
  },
  {
    name: 'Investment Account',
    type: 'Investment',
    balance: '$453',
    analytics: {
      percentage: '+12.5%',
      duration: 'this month',
    },
  },
];

const accountIcons = [checkingImg, creditCardImg, investmentImg, savingsImg];

export default function AccountBalanceCard({ className, acctData = data }) {
  return (
    <Card className={`p-6 ${className}`}>
      {/* Header */}
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Account Balance</h3>
          <p className="text-xs text-[#434343]">Available balance</p>
        </div>
      </div>
      <div className="space-y-4">
        {acctData.length > 0 ? (
          acctData.map((acct, i) => {
            return (
              <div
                key={i}
                className="flex items-center justify-between gap-2 rounded-2xl border border-[#F0EEFF] p-4"
              >
                <div className="flex items-center gap-2">
                  <div className="flex size-11 items-center justify-center rounded-full bg-[#3300C9]/10">
                    <img src={accountIcons[i]} alt={acct.type} />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold">{acct.name}</h4>
                    <p className="text-xs text-[#7D7D7D]">{acct.type}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <p className="text-xs font-semibold">{acct.balance}</p>
                  <p className="text-xs text-[#7D7D7D]">
                    <span className="pr-1 text-[#6FD195]">
                      {acct.analytics.percentage}
                    </span>{' '}
                    <span>{acct.analytics.duration}</span>
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex h-40 w-full items-center justify-center bg-white">
            <img src={emptyStateImg} alt="Empty State" />
          </div>
        )}
      </div>
    </Card>
  );
}
