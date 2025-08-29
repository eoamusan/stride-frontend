import { Card } from '@/components/ui/card';
import { quickActions } from '@/constants/account-quick-actions';
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
          <h3 className="text-lg font-semibold">Quick Actions</h3>
          <p className="text-xs text-[#434343]">Common accounting tasks</p>
        </div>
        <button className="flex cursor-pointer items-center gap-1 text-sm font-medium text-[#17191C]">
          <span className="underline">Add options</span>
          <BadgeInfoIcon size={14} color="#EF4444" />
        </button>
      </div>

      {/* Content */}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {quickActions.map((action, i) => (
          <div
            onClick={() => handleActionClick(action)}
            key={i}
            className="flex min-h-[104px] w-full cursor-pointer flex-col items-center justify-center gap-2.5 rounded-2xl border-1 border-[#F0EEFF]"
          >
            <img src={action.icon} alt={action.title} width={20} height={20} />
            <div className="text-center">
              <h3 className="text-sm font-medium">{action.title}</h3>
              <p className="mt-1 text-xs text-[#292D32]">
                {action.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
