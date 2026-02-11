import { Badge } from '@/components/ui/badge';

import ClockIcon from '@/assets/icons/clock.svg';
import UsersIcon from '@/assets/icons/users.svg';
import EyeIcon from '@/assets/icons/eye.svg';
import TrashIcon from '@/assets/icons/gray-delete.svg';
import EditIcon from '@/assets/icons/gray-edit.svg';

export default function CourseCard({
  image,
  status = 'Draft',
  category,
  title,
  duration = '45mins',
  trainees = 24,
  deliveryMode = 'Online',
  onView,
  onEdit,
  onDelete,
  categoryVariant = 'default',
  statusVariant = 'secondary',
}) {
  return (
    <div className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md transition-shadow hover:shadow-md">
      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />

        {status && (
          <Badge
            variant={statusVariant}
            className="absolute top-3 right-3 bg-white/90 px-3 py-1 border-sm text-gray-700 hover:bg-white"
          >
            {status}
          </Badge>
        )}
      </div>

      {/* Card Content */}
      <div className="flex flex-col gap-6 px-5 py-6">
        <div className="flex flex-col gap-4">
          {category && (
            <Badge
              variant={categoryVariant}
              className="w-fit rounded-full bg-purple-100 px-4 py-1 text-xs text-purple-700 hover:bg-purple-100"
            >
              {category}
            </Badge>
          )}

          <h3 className="text-base font-bold text-gray-900">{title}</h3>

          <div className="flex items-center gap-5 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <img src={ClockIcon} alt="Duration" />
              <span className="text-gray-900">{duration}</span>
            </div>

            <div className="flex items-center gap-1">
              <img src={UsersIcon} alt="Trainees" />
              <span className="text-gray-900">{trainees} Trainees</span>
            </div>
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* Footer Actions */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-700">{deliveryMode}</span>

          <div className="flex items-center gap-2">
            {onView && (
              <button
                onClick={onView}
                className="rounded-lg text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                aria-label="View course"
              >
                <img src={EyeIcon} alt="View Icon" />
              </button>
            )}

            {onEdit && (
              <button
                onClick={onEdit}
                className="rounded-lg text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                aria-label="Edit course"
              >
                <img src={EditIcon} alt="Edit Icon" />
              </button>
            )}

            {onDelete && (
              <button
                onClick={onDelete}
                className="rounded-lg text-gray-600 transition-colors hover:bg-gray-100 hover:text-red-600 cursor-pointer"
                aria-label="Delete course"
              >
                <img src={TrashIcon} alt="Delete Icon" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
