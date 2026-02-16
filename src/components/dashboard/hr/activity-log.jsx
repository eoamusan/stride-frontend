import { CheckCircleIcon } from 'lucide-react';

export default function ActivityLog({ activity }) {
  return (
    <div className="rounded-xl bg-white p-6">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Activity Log</h2>
      <div className="relative space-y-4 pb-2">
        <div
          className="absolute top-6 bottom-6 left-[35px] w-px border-l-2 border-dashed border-[#24A959]"
          aria-hidden="true"
        />
        {activity.map((item, index) => (
          <div
            key={index}
            className="relative flex gap-4 rounded-xl border border-gray-100 bg-white p-4"
          >
            <div className="flex-shrink-0">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full bg-[#24A959] ${item.checked ? 'bg-[#24A959]' : 'bg-gray-100'}`}
              >
                <CheckCircleIcon className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-base font-medium text-gray-900">
                {item.title}
              </p>
              <p className="text-sm text-gray-500">{item.description}</p>
            </div>
            {item.checked && (
              <div className="absolute right-4 flex flex-col content-end items-end justify-center gap-1 text-xs">
                <p>{item.date}</p>
                <p>{item.time}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
