import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import CourseContentModule from './courseContentModule';
import { useFieldArray, useFormContext } from 'react-hook-form';

export default function CourseContent() {
  const { control } = useFormContext();
  const { fields, append } = useFieldArray({
    control,
    name: 'modules',
  });

  const handleAddModule = () => {
    append({
      type: 'reading-material',
      title: '',
      description: '',
      duration: '',
      order: fields.length + 1,
      file: null,
    });
  };

  return (
    <div className="space-y-2">
      <h3 className="font-medium text-gray-600">Course Content</h3>

      <div className="rounded-lg border border-gray-200">
        <div className="flex items-center justify-between rounded-t-lg border-b bg-gray-50 p-4">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-gray-500">
              Learning Materials
            </p>

            <p className="text-xs text-gray-400">
              Add materials to support learning and growth here.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            className="border-green-900 text-green-900 text-sm hover:bg-green-50 rounded-xl"
            onClick={handleAddModule}
          >
            <Plus className="mr-1 h-4 w-4" />
            Add More
          </Button>
        </div>

        <div className="space-y-6 p-4">
          {fields.map((field, index) => (
            <div key={field.id}>
              <CourseContentModule key={field.id} index={index} />

              {fields.length > 1 && <hr className="border-gray-200 mt-4" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
