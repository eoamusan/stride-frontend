const budgetData = [
  {
    id: 1,
    label: 'Food & Drinking',
    spent: 300,
    budget: 1000,
    color: 'bg-red-500',
  },
  {
    id: 2,
    label: 'Transportation',
    spent: 450,
    budget: 1000,
    color: 'bg-blue-500',
  },
  {
    id: 3,
    label: 'Entertainment',
    spent: 550,
    budget: 1000,
    color: 'bg-gray-700',
  },
  {
    id: 4,
    label: 'Shopping',
    spent: 650,
    budget: 1000,
    color: 'bg-blue-900',
  },
];

export default function RangeOverviewCard({
  className = '',
  data = budgetData,
  title = 'Budget Overview',
}) {
  return (
    <div className={`rounded-2xl bg-white p-6 shadow-sm ${className}`}>
      <h2 className="mb-6 text-lg font-semibold text-gray-900">{title}</h2>

      <div className="space-y-6">
        {data.map((item) => {
          const percentage = Math.min((item.spent / item.budget) * 100, 100);

          return (
            <div key={item.id}>
              {/* Category label and amounts */}
              <div className="mb-2 flex items-center justify-between">
                <span className="font-medium text-gray-900">{item.label}</span>
                <span className="text-sm text-gray-700">
                  ${item.spent} / ${item.budget}
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className={`h-full rounded-full transition-all duration-300 ease-in-out ${item.color}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
