import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  User,
  Mail,
  Phone,
  IdCardLanyardIcon,
  UploadIcon,
  X,
} from 'lucide-react';
import RichTextEditor from '@/components/dashboard/rich-text-editor';

// Zod schema for form validation
const contactSupplierSchema = z.object({
  requestType: z.string().min(1, 'Request type is required'),
  priority: z.string().min(1, 'Priority is required'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(1, 'Message is required'),
});

export default function ContactSupplierForm({
  open,
  onOpenChange,
  supplierData,
  onSubmit,
  openSuccessModal,
}) {
  // File upload state and refs
  const [attachmentFiles, setAttachmentFiles] = useState([]);
  const attachmentFileInputRef = useRef(null);

  const form = useForm({
    resolver: zodResolver(contactSupplierSchema),
    defaultValues: {
      requestType: '',
      priority: '',
      subject: '',
      message: '',
    },
  });

  const { handleSubmit, reset } = form;

  // File upload handlers
  const handleAttachmentFileSelect = (event) => {
    const files = Array.from(event.target.files);

    files.forEach((file) => {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert(
          `File "${file.name}" is too large. File size must be less than 10MB`
        );
        return;
      }

      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];
      if (!allowedTypes.includes(file.type)) {
        alert(
          `File "${file.name}" is not supported. Only PDF, DOC, and DOCX files are allowed`
        );
        return;
      }

      // Check if file already exists
      setAttachmentFiles((prev) => {
        const fileExists = prev.some(
          (existingFile) =>
            existingFile.name === file.name && existingFile.size === file.size
        );

        if (fileExists) {
          alert(`File "${file.name}" is already attached`);
          return prev;
        }

        return [...prev, file];
      });
    });

    // Clear the input so the same file can be selected again if needed
    event.target.value = '';
  };

  const removeAttachmentFile = (fileToRemove) => {
    setAttachmentFiles((prev) => prev.filter((file) => file !== fileToRemove));
  };

  const removeAllAttachments = () => {
    setAttachmentFiles([]);
    if (attachmentFileInputRef.current) {
      attachmentFileInputRef.current.value = '';
    }
  };

  const handleCancel = () => {
    reset();
    setAttachmentFiles([]);
    onOpenChange?.(false);
  };

  const onFormSubmit = (data) => {
    const formData = {
      ...data,
      supplier: supplierData,
      attachments: attachmentFiles,
    };

    console.log('Contact request data:', formData);

    if (onSubmit) {
      onSubmit(formData);
    }

    reset();
    setAttachmentFiles([]);
    onOpenChange?.(false);
    openSuccessModal?.(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-[90%] overflow-y-auto p-8 sm:max-w-3xl">
        {/* Header */}
        <div className="flex gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#254C00]">
            <IdCardLanyardIcon className="size-4 text-white" />
          </div>
          <div>
            <DialogHeader>
              <DialogTitle>Contact Supplier</DialogTitle>
              <DialogDescription>{supplierData?.name}</DialogDescription>
            </DialogHeader>
          </div>
        </div>

        {/* Supplier Contact Information */}
        <div className="mt-2 flex flex-wrap items-center gap-6 text-sm text-[#434343]">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>{supplierData?.contactPerson}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span>{supplierData?.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <span>{supplierData?.phone}</span>
          </div>
        </div>

        <Form {...form}>
          <form
            onSubmit={handleSubmit(onFormSubmit)}
            className="space-y-6 py-4"
          >
            {/* Request Type and Priority Row */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Request Type */}
              <FormField
                control={form.control}
                name="requestType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Request Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10 w-full">
                          <SelectValue placeholder="Request Type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="quote">Quote</SelectItem>
                        <SelectItem value="inquiry">General Inquiry</SelectItem>
                        <SelectItem value="order">Order Request</SelectItem>
                        <SelectItem value="support">Support</SelectItem>
                        <SelectItem value="complaint">Complaint</SelectItem>
                        <SelectItem value="payment">Payment Issue</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Priority */}
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10 w-full">
                          <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Subject */}
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter message subject"
                      {...field}
                      className="h-10"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Message */}
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <div className="rounded-md border">
                      <RichTextEditor
                        placeholder="Type message..."
                        currentValue={field.value}
                        setCurrentValue={field.onChange}
                        className="min-h-[200px]"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between">
                <Label>Add attachments</Label>
                {attachmentFiles.length > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeAllAttachments}
                    className="text-xs"
                  >
                    Clear all
                  </Button>
                )}
              </div>
              <input
                type="file"
                ref={attachmentFileInputRef}
                onChange={handleAttachmentFileSelect}
                accept=".pdf,.doc,.docx"
                multiple
                className="hidden"
              />

              {/* Display attached files */}
              {attachmentFiles.length > 0 && (
                <div className="space-y-2">
                  {attachmentFiles.map((file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="rounded bg-blue-100 p-2">
                          <UploadIcon className="text-primary h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAttachmentFile(file)}
                        className="text-red-400 hover:text-red-600"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload area */}
              <div
                onClick={() => attachmentFileInputRef.current?.click()}
                className="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-6 text-center hover:border-gray-400 hover:bg-gray-50"
              >
                <UploadIcon className="text-primary mx-auto h-8 w-8" />
                <p className="mt-2 text-sm text-gray-600">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  PDF, DOC, DOCX (max 10MB each) • Multiple files supported
                </p>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end space-x-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="h-10 min-w-[120px] rounded-full"
              >
                Cancel
              </Button>
              <Button type="submit" className="h-10 min-w-[140px] rounded-full">
                Send Message
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
