import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { UploadIcon, X } from 'lucide-react';

export default function AttachmentsStep({ onFilesChange }) {
  const [dragActive, setDragActive] = useState({
    taxClearance: false,
    incorporation: false,
    companyLogo: false,
    vendorPassport: false,
  });
  const [uploadedFiles, setUploadedFiles] = useState({
    taxClearance: [],
    incorporation: [],
    companyLogo: [],
    vendorPassport: [],
  });

  const handleDrag = (uploadType, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive((prev) => ({ ...prev, [uploadType]: true }));
    } else if (e.type === 'dragleave') {
      setDragActive((prev) => ({ ...prev, [uploadType]: false }));
    }
  };

  const handleDrop = (uploadType, e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive((prev) => ({ ...prev, [uploadType]: false }));
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(uploadType, e.dataTransfer.files);
    }
  };

  const handleFiles = (uploadType, files) => {
    const fileArray = Array.from(files);
    setUploadedFiles((prev) => ({
      ...prev,
      [uploadType]: [...prev[uploadType], ...fileArray],
    }));
  };

  // Notify parent component of file changes
  useEffect(() => {
    if (onFilesChange) {
      onFilesChange(uploadedFiles);
    }
  }, [uploadedFiles, onFilesChange]);

  const removeFile = (uploadType, index) => {
    setUploadedFiles((prev) => ({
      ...prev,
      [uploadType]: prev[uploadType].filter((_, i) => i !== index),
    }));
  };

  const renderUploadArea = (uploadType, label) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div
        className={`bg-muted cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
          dragActive[uploadType]
            ? 'border-primary bg-blue-50'
            : 'border-gray-300'
        }`}
        onDragEnter={(e) => handleDrag(uploadType, e)}
        onDragLeave={(e) => handleDrag(uploadType, e)}
        onDragOver={(e) => handleDrag(uploadType, e)}
        onDrop={(e) => handleDrop(uploadType, e)}
        onClick={() =>
          document.getElementById(`file-upload-${uploadType}`).click()
        }
      >
        <div className="flex flex-col items-center space-y-3">
          <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
            <UploadIcon className="text-primary h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium">
              Click or drag file to this area to upload
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Support for a single or bulk upload.
            </p>
          </div>
          <input
            type="file"
            multiple
            onChange={(e) => handleFiles(uploadType, e.target.files)}
            className="hidden"
            id={`file-upload-${uploadType}`}
          />
        </div>
      </div>

      {/* Display uploaded files */}
      {uploadedFiles[uploadType].length > 0 && (
        <div className="mt-3">
          <p className="mb-2 text-sm font-medium">Uploaded Files:</p>
          <div className="space-y-2">
            {uploadedFiles[uploadType].map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded bg-gray-50 p-2"
              >
                <span className="text-sm">{file.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(uploadType, index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {renderUploadArea(
        'incorporation',
        'Upload of Certificate of Incorporation (optional)'
      )}
      {renderUploadArea(
        'companyLogo',
        'Upload of Company logo file in Jpeg or PNG (optional)'
      )}
      {renderUploadArea(
        'taxClearance',
        'Upload of Tax Clearance Certificate (optional)'
      )}
      {renderUploadArea(
        'vendorPassport',
        "Upload of Vendor's Passport (optional)"
      )}
    </div>
  );
}
