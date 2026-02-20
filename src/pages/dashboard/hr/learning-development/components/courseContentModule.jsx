import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { useRef } from 'react';
import UploadedFile from './uploadedFile';
import { useFormContext, useWatch } from 'react-hook-form';
import { FormSelect } from '@/components/customs';

export default function CourseContentModule({ index }) {
  const { control, setValue } = useFormContext();
  const fileInputRef = useRef(null);
  const moduleType = useWatch({ control, name: `modules.${index}.type` });
  const uploadedFile = useWatch({ control, name: `modules.${index}.file` });

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue(`modules.${index}.file`, file, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  };

  const getAcceptType = () => {
    if (moduleType === 'video-lessons') {
      return 'video/*';
    }
    return '.pdf,.doc,.docx,.ppt,.pptx, video/*';
  };

  const getUploadButtonText = () => {
    if (moduleType === 'video-lessons') {
      return 'Add Video';
    }
    return 'Add Document';
  };

  return (
    <div className="space-y-4 bg-white">
      {/* Module Type */}
      <FormSelect
        control={control}
        name={`modules.${index}.type`}
        label="Module Type"
        placeholder="Reading Material"
        options={[
          { value: 'reading-material', label: 'Reading Material' },
          { value: 'video-lessons', label: 'Video Lessons' },
          { value: 'interactive-quiz', label: 'Interactive Quiz' },
          { value: 'assignment', label: 'Assignment' },
        ]}
      />

      {/* Module Title */}
      <FormField
        control={control}
        name={`modules.${index}.title`}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700">
              Module Title
            </FormLabel>
            <FormControl>
              <Input
                placeholder="e.g. Introduction to Information Security"
                className="w-full"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Short Description */}
      <FormField
        control={control}
        name={`modules.${index}.description`}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700">
              Short Description
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="Brief description that will appear in the module list..."
                rows={3}
                className="w-full resize-none"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Estimated Duration and Module Order */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
          name={`modules.${index}.duration`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Estimated Duration
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. 2 hours"
                  className="w-full"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`modules.${index}.order`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Module Order
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Position in sequence"
                  type="number"
                  className="w-full"
                  value={field.value ?? ''}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Uploaded File Display */}
      {uploadedFile && (
        <UploadedFile
          file={uploadedFile}
          type={moduleType === 'video-lessons' ? 'video' : 'document'}
          onRemove={() =>
            setValue(`modules.${index}.file`, null, {
              shouldDirty: true,
              shouldValidate: true,
            })
          }
        />
      )}

      {/* Add Document/Video Button */}
      {!uploadedFile && (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept={getAcceptType()}
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            className="w-full border-2 border-gray-300 bg-white text-gray-400 font-medium hover:bg-gray-50 py-8 text-sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="mr-2 h-4 w-4" />
            {getUploadButtonText()}
          </Button>
        </>
      )}
    </div>
  );
}
