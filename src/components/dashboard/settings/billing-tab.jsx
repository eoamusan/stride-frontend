import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import paystackLogo from '@/assets/icons/paystack-logo.svg';
import { CirclePlus } from 'lucide-react';

export default function BillingTab({ billingData }) {
  return (
    <div>
      <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-[8vw]">
        {/* Current Plan */}
        <div className="w-full">
          <div className="mb-4 flex items-center justify-between">
            <div className="max-w-90.75">
              <h2 className="mb-1 text-base font-bold text-zinc-800">
                Current Plan
              </h2>
              <p className="text-sm text-zinc-800">
                Thanks for using our free member and supporting our development.
              </p>
            </div>
            <Button>Upgrade</Button>
          </div>
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-3">
            <div className="flex flex-col justify-between">
              <span className="text-sm text-zinc-800">Current Plan</span>
              <span className="text-sm font-semibold text-zinc-800">
                {billingData.currentPlan}
              </span>
            </div>
            <div className="flex flex-col justify-between">
              <span className="text-sm text-zinc-800">Billing Cycle</span>
              <span className="text-sm font-semibold text-zinc-800">
                {billingData.billingCycle}
              </span>
            </div>
            <div className="flex flex-col justify-between">
              <span className="text-sm text-zinc-800">Plan Cost</span>
              <span className="text-sm font-semibold text-zinc-800">
                {billingData.planCost}
              </span>
            </div>
            <div className="flex flex-col justify-between">
              <span className="text-sm text-zinc-800">Renewal Date</span>
              <span className="text-sm font-semibold text-zinc-800">
                {billingData.renewalDate}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="flex flex-col justify-between gap-4">
          <h2 className="mb-1 text-base font-bold text-zinc-800">
            Payment Method
          </h2>
          <div>
            <div className="flex h-26.25 items-center justify-center rounded-xl border border-gray-200 p-4">
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center">
                    <img src={paystackLogo} alt="Paystack Logo" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#011B33]">paystack</p>
                    <p className="text-xs text-gray-500">Safe Online payment</p>
                  </div>
                </div>
                <Checkbox checked />
              </div>
            </div>
            <button className="text-primary hover:text-primary mt-3 flex cursor-pointer items-center gap-2 text-sm">
              <CirclePlus size={16} className="text-primary" />
              Add new payment method
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
