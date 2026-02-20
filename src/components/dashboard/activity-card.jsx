import { Plus } from 'lucide-react';

export default function ActivityCard({
  icon = Plus,
  iconBgColor = 'bg-green-100',
  iconColor = 'text-green-600',
  title = 'Added 50 units of fresh apples',
  timestamp = '2 hours ago',
}) {
  const IconComponent = icon;

  return (
    <div className="flex items-center space-x-3 rounded-2xl border border-gray-100 bg-white p-4">
      {/* Icon */}
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-full ${iconBgColor}`}
      >
        <IconComponent className={`h-5 w-5 ${iconColor}`} />
      </div>

      {/* Content */}
      <div className="flex-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-1 text-xs text-[#434343]/50">{timestamp}</p>
      </div>
    </div>
  );
}
