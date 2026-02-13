import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PencilLine, Trash2 } from 'lucide-react';

import ClockIcon from '@/assets/icons/white-clock.svg';
import UsersIcon from '@/assets/icons/white-users.svg';
import BackArrowIcon from '@/assets/icons/back-arrow.svg';
import EditIcon from '@/assets/icons/edit.svg';
import DeleteIcon from '@/assets/icons/delete.svg';

import CourseModuleRow from './courseModuleRow';

const badgeStylesByTag = {
  compliance: 'bg-blue-800 hover:bg-blue-900',
  mandatory: 'bg-red-600 hover:bg-red-100',
  online: 'bg-green-600 hover:bg-green-100',
  hybrid: 'bg-green-100 hover:bg-green-100',
  'in-person': 'bg-green-100 text-green-700 hover:bg-green-100',
};

export default function ViewCourseDetails({
  course,
  onBack,
  onEdit,
  onDelete,
}) {
  if (!course) return null;

  const tags = [
    course.categoryTag ?? 'compliance',
    course.isMandatory ? 'mandatory' : null,
    course.deliveryMode?.toLowerCase() ?? 'online',
  ].filter(Boolean);

  return (
    <div className="space-y-7">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xl font-semibold text-black hover:text-gray-900"
        >
          <img src={BackArrowIcon} alt="back" />
          View Details
        </button>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            className="h-10 rounded-xl px-4 md:px-10 text-sm"
            onClick={onEdit}
          >
            <img src={EditIcon} alt="edit" className="h-4 w-4" />
            Edit Course
          </Button>

          <Button
            type="button"
            variant="outline"
            className="h-10 rounded-xl border-red-500 px-4 md:px-10 text-sm text-red-600 hover:bg-red-50"
            onClick={onDelete}
          >
            <img src={DeleteIcon} alt="delete" className="h-4 w-4" />
            Delete Course
          </Button>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-t-lg">
        <div className="absolute inset-0">
          <img
            src={course.image}
            alt={course.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gray-900/70" />
        </div>

        <div className="relative flex flex-col gap-6 ps-6 pe-12 py-6 md:py-12 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <div className="mb-2 flex flex-wrap items-center gap-3">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  className={`min-w-24 rounded-lg px-3 py-2 text-xs font-medium text-white ${
                    badgeStylesByTag[tag] ??
                    'bg-gray-100 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {tag === 'in-person'
                    ? 'In Person'
                    : tag
                        .split('-')
                        .map((w) => w[0].toUpperCase() + w.slice(1))
                        .join(' ')}
                </Badge>
              ))}
            </div>

            <h1 className="text-2xl font-semibold text-white md:text-[28px]">
              {course.title}
            </h1>

            {course.description && (
              <p className="mt-2 text-white text-sm md:text-base">{course.description}</p>
            )}
          </div>

          <div className="flex flex-col items-start gap-6 text-sm text-white">
            <div className="flex items-center gap-1">
              <img src={ClockIcon} alt="duration" />
              <span>{course.duration}</span>
            </div>

            <div className="flex items-center gap-1">
              <img src={UsersIcon} alt="trainees" />
              <span>{course.trainees} Trainees</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-700">Course Modules</h2>

        <div className="space-y-8 rounded-2xl">
          {(course.modules ?? []).map((module) => (
            <CourseModuleRow key={module.id} module={module} />
          ))}
        </div>
      </div>
    </div>
  );
}
