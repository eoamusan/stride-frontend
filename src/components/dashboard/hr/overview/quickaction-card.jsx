import { Card } from '@/components/ui/card';
import { HRQuickActions } from '@/constants/account-quick-actions';
import { BadgeInfoIcon } from 'lucide-react';

export default function QuickActionsCard({ className }) {
  const handleActionClick = (action) => {
    // Implement the action handling logic here
    console.log('Action clicked:', action);
  };

  return (
    <Card className={`p-6 ${className}`}>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="leading-6 font-semibold">Quick Actions</h3>
          <p className="text-sm text-[#434343]">Management tasks</p>
        </div>
        <button className="flex cursor-pointer items-center gap-1 text-sm font-medium text-[#17191C]">
          <span className="underline">Add options</span>
          <BadgeInfoIcon size={14} color="#EF4444" />
        </button>
      </div>

      {/* Content */}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {HRQuickActions.map((action, i) => (
          <div
            onClick={() => handleActionClick(action)}
            key={i}
            className="flex min-h-28 w-full cursor-pointer flex-col items-center justify-center gap-2.5 rounded-2xl border border-[#F0EEFF]"
          >
            <img src={action.icon} alt={action.title} width={20} height={20} />
            <div className="text-center">
              <h3 className="text-base font-medium">{action.title}</h3>
              <p className="mt-1 text-sm text-[#292D32]">
                {action.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
