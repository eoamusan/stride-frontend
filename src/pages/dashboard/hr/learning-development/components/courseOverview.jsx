import { useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { FormSelect } from '@/components/customs';

import FileIcon from '@/assets/icons/file.svg';

export default function CourseOverview() {
  const { control, setValue, watch } = useFormContext();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const thumbnailFile = watch('thumbnail');

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setValue('thumbnail', file, { shouldDirty: true, shouldValidate: true });
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue('thumbnail', file, { shouldDirty: true, shouldValidate: true });
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-600">Course Overview</h3>

      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700">
              Course Title
            </FormLabel>

            <FormControl>
              <Input
                placeholder="e.g. Advanced Leadership Principles"
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
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700">
              Description
            </FormLabel>

            <FormControl>
              <Textarea
                placeholder="Describe what learners will gain from this course..."
                rows={4}
                className="w-full resize-none"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormSelect
        control={control}
        name="category"
        label="Category"
        placeholder="Technical Skills"
        options={[
          { value: 'technical-skills', label: 'Technical Skills' },
          { value: 'soft-skills', label: 'Soft Skills' },
          { value: 'compliance', label: 'Compliance' },
          { value: 'leadership', label: 'Leadership' },
          { value: 'management', label: 'Management' },
        ]}
      />

      <FormSelect
        control={control}
        name="format"
        label="Format"
        placeholder="Online"
        options={[
          { value: 'online', label: 'Online' },
          { value: 'in-person', label: 'In-Person' },
          { value: 'hybrid', label: 'Hybrid' },
        ]}
      />

      <div className="space-y-2">
        <FormLabel className="text-sm font-medium text-gray-700">
          Thumbnail
        </FormLabel>

        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
            isDragging
              ? 'border-green-500 bg-green-50'
              : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          <img src={FileIcon} alt="File Icon" className="mb-3" />

          <p className="mb-1 font-medium text-gray-900">
            Click or drag file to this area to upload
          </p>

          <p className="text-sm text-gray-500">Click to upload image</p>

          {thumbnailFile && (
            <p className="mt-2 text-xs text-green-600">
              Selected: {thumbnailFile.name}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
