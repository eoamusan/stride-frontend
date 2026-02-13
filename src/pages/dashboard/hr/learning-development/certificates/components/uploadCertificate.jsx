import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import CalendarIcon from '@/assets/icons/calendar-search.svg';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import React, { useRef, useState } from 'react';
import { CustomButton } from '@/components/customs';
import { FormSelect } from '@/components/customs';
import FileIcon from '@/assets/icons/file.svg';

const uploadCertificateSchema = z.object({
  employee: z.string().min(1, { message: 'Employee is required' }),
  certificateType: z
    .string()
    .min(1, { message: 'Certificate type is required' }),
  startDate: z.date({ message: 'Start date is required' }),
  expiryDate: z.date({ message: 'Expiry date is required' }),
  file: z.any().refine((file) => file && file.length > 0, {
    message: 'Certificate file is required',
  }),
});

const employeeOptions = [
  { value: '1', label: 'Sarah Jenkins' },
  { value: '2', label: 'Michael Chen' },
  { value: '3', label: 'Emily Rodriguez' },
  { value: '4', label: 'James Wilson' },
  { value: '5', label: 'Jessica Lee' },
  { value: '6', label: 'David Kumar' },
];

const certificateTypeOptions = [
  { value: 'react', label: 'Advanced React Patterns' },
  { value: 'privacy', label: 'Data Privacy Compliance' },
  { value: 'leadership', label: 'Leadership Skills Development' },
  { value: 'cloud', label: 'Cloud Computing Basics' },
  { value: 'business', label: 'Business Communication' },
  { value: 'python', label: 'Python for Data Science' },
];

export default function UploadCertificateModalContent({ onBack, onSubmit }) {
  const form = useForm({
    resolver: zodResolver(uploadCertificateSchema),
    defaultValues: {
      employee: '',
      certificateType: '',
      startDate: new Date(),
      expiryDate: new Date(),
      file: undefined,
    },
  });

  // File upload state
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // File select handler
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      form.setValue('file', [file], { shouldValidate: true });
      setUploadError('');
    }
  };

  // Drag and drop handlers
  const handleClick = () => {
    fileInputRef.current?.click();
  };
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
    if (file) {
      setThumbnailFile(file);
      form.setValue('file', [file], { shouldValidate: true });
      setUploadError('');
    }
  };

  // Form submit handler
  const handleFormSubmit = async (data) => {
    setUploading(true);
    setUploadError('');
    setUploadSuccess(false);
    try {
      // Prepare form data for API
      const formData = new FormData();
      formData.append('employee', data.employee);
      formData.append('certificateType', data.certificateType);
      formData.append('startDate', format(data.startDate, 'yyyy-MM-dd'));
      formData.append('expiryDate', format(data.expiryDate, 'yyyy-MM-dd'));
      formData.append('file', data.file[0]);

      // Example: call API (replace with actual API call)
      // await api.uploadCertificate(formData);

      // If parent onSubmit is provided, call it
      if (onSubmit) {
        await onSubmit({
          ...data,
          startDate: format(data.startDate, 'yyyy-MM-dd'),
          expiryDate: format(data.expiryDate, 'yyyy-MM-dd'),
          file: data.file[0],
        });
      }
      setUploadSuccess(true);
      setThumbnailFile(null);
      form.reset();
    } catch (err) {
      setUploadError('Failed to upload certificate. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-6"
      >
        {/* Row 1: Employee & Certificate Type */}
        <div className="flex flex-col gap-4 md:flex-row">
          <FormSelect
            control={form.control}
            name="employee"
            label="Employee"
            placeholder="Select employee..."
            options={employeeOptions}
            className="w-full"
          />
          <FormSelect
            control={form.control}
            name="certificateType"
            label="Certificate Type"
            placeholder="Select certificate type..."
            options={certificateTypeOptions}
            className="w-full"
          />
        </div>

        {/* Row 2: Start Date & Expiry Date */}
        <div className="flex flex-col gap-4 md:flex-row">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Start Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-16 w-full justify-between rounded-xl py-6 text-left text-sm font-normal"
                    >
                      {field.value ? format(field.value, 'PPP') : 'Pick a date'}
                      <img
                        src={CalendarIcon}
                        alt="Calendar Icon"
                        className="ml-2"
                      />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="expiryDate"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Expiry Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-16 w-full justify-between rounded-xl py-6 text-left text-sm font-normal"
                    >
                      {field.value ? format(field.value, 'PPP') : 'Pick a date'}
                      <img
                        src={CalendarIcon}
                        alt="Calendar Icon"
                        className="ml-2"
                      />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-2">
          <FormLabel className="text-sm font-medium text-gray-700">
            Upload Certificate
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
              accept="image/*,application/pdf"
              onChange={handleFileSelect}
              className="hidden"
            />
            <img src={FileIcon} alt="File Icon" className="mb-3" />
            <p className="mb-1 font-medium text-gray-900">
              Click or drag file to this area to upload
            </p>
            <p className="text-sm text-gray-500">
              Click to upload image or PDF
            </p>
            {thumbnailFile && (
              <p className="mt-2 text-xs text-green-600">
                Selected: {thumbnailFile.name}
              </p>
            )}
            {uploadError && (
              <p className="mt-2 text-xs text-red-600">{uploadError}</p>
            )}
            {uploadSuccess && (
              <p className="mt-2 text-xs text-green-600">Upload successful!</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3">
          <CustomButton
            variant="outline"
            type="button"
            onClick={onBack}
            disabled={uploading}
          >
            Back
          </CustomButton>
          <CustomButton type="submit" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload Certificate'}
          </CustomButton>
        </div>
      </form>
    </Form>
  );
}
