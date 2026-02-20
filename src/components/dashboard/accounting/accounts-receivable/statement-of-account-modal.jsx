import { useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { InboxIcon, FileIcon, XIcon, CheckCircle2Icon } from 'lucide-react';

export default function StatementOfAccountModal({ isOpen, onClose, customer }) {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      setUploadedFile(files[0]);
    }
  }, []);

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      setUploadedFile(files[0]);
    }
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation();
    setUploadedFile(null);
  };

  const handleNext = () => {
    if (uploadedFile) {
      console.log(
        'Processing statement for:',
        customer,
        'with file:',
        uploadedFile
      );
      // TODO: Implement file upload and statement generation
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Upload Company Stamp
          </DialogTitle>
          <p className="text-sm text-[#7D7D7D]">
            Upload your company stamp for your statement of account
          </p>
        </DialogHeader>

        <div className="mt-6">
          {/* File Upload Area */}
          <div
            className={`relative flex min-h-50 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
              isDragging
                ? 'border-primary bg-primary/5'
                : uploadedFile
                  ? 'border-[#254c00] bg-[#254c00]/10'
                  : 'border-gray-300 bg-gray-50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() =>
              !uploadedFile &&
              document.getElementById('file-upload-input').click()
            }
          >
            <input
              id="file-upload-input"
              type="file"
              className="hidden"
              accept="image/*,.pdf"
              onChange={handleFileSelect}
            />

            {uploadedFile ? (
              /* File Uploaded State */
              <div className="flex w-full flex-col items-center justify-center py-8 text-center">
                <div className="relative mb-4 flex items-center justify-center">
                  <div className="rounded-lg bg-[#254c00] p-4">
                    <CheckCircle2Icon
                      className="h-12 w-12 text-white"
                      strokeWidth={1.5}
                    />
                  </div>
                </div>

                <div className="mb-2 flex items-center gap-2">
                  <FileIcon className="h-5 w-5 text-gray-600" />
                  <p className="text-base font-semibold text-gray-900">
                    {uploadedFile.name}
                  </p>
                </div>

                <p className="mb-4 text-sm text-gray-500">
                  {(uploadedFile.size / 1024).toFixed(2)} KB
                </p>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRemoveFile}
                  className="gap-2"
                >
                  <XIcon className="h-4 w-4" />
                  Remove file
                </Button>
              </div>
            ) : (
              /* Upload Prompt State */
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="bg-primary/10 mb-4 rounded-lg p-4">
                  <InboxIcon
                    className="text-primary h-8 w-8"
                    strokeWidth={1.5}
                  />
                </div>
                <p className="mb-2 text-base font-medium text-gray-900">
                  Click or drag file to this area to upload
                </p>
                <p className="text-sm text-gray-500">
                  Support for a single or bulk upload.
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="h-10 min-w-30 rounded-2xl"
            >
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={!uploadedFile}
              className="h-10 w-full max-w-50 min-w-30 rounded-2xl"
            >
              Next
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
