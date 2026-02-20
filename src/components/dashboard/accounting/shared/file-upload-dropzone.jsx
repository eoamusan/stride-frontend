import { useRef, useState } from "react"
import { UploadIcon, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function FileUploadDropzone({
  multiple = true,
  onFilesChange,
  accept,
  title = "Click or drag file to this area to upload",
  subtitle = "Support for a single or bulk upload.",
}) {
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const inputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files?.length) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFiles = (files) => {
    const fileArray = Array.from(files)
    setUploadedFiles((prev) => [...prev, ...fileArray])
    onFilesChange?.(fileArray)
  }

  const removeFile = (index) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div>
      {/* Dropzone */}
      <div
        className={cn(
          "rounded-lg border-2 border-dashed p-8 py-4 text-center transition-colors",
          dragActive ? "border-primary bg-blue-50" : "border-gray-300"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
            <UploadIcon className="h-6 w-6 text-primary" />
          </div>

          <div>
            <p className="text-sm font-medium">{title}</p>
            <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
          </div>

          <input
            ref={inputRef}
            type="file"
            multiple={multiple}
            accept={accept}
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
          />

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => inputRef.current?.click()}
          >
            Browse Files
          </Button>
        </div>
      </div>

      {/* Uploaded files list */}
      {uploadedFiles.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-sm font-medium">Uploaded Files:</p>
          <div className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded bg-gray-50 p-2"
              >
                <span className="text-sm truncate">{file.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
