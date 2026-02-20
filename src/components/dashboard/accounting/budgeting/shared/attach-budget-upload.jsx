import { formatDate } from "@/lib/utils";
import xlsxIcon from '@/assets/images/xlsx-icon.png';
import { X } from "lucide-react";

export default function AttachBudgetUpload({budgetFile, removeAttachment}) {
  function convertToMb(sizeInBytes) {
    return (sizeInBytes / (1024 * 1024)).toFixed(2) + ' MB';
  }

  function formatFileName(name) {
    const maxLength = 20;
    if (name.length <= maxLength) {
      return name;
    }
    const extensionIndex = name.lastIndexOf('.');
    const extension = extensionIndex !== -1 ? name.slice(extensionIndex) : '';
    const truncatedName = name.slice(0, maxLength - extension.length - 3);
    return `${truncatedName}...${extension}`;
  }
  return <>
  <div className="flex gap-4 justify-between items-center border border-[#F0EEFF] px-4 py-2 text-xs rounded-2xl relative">
    <div className="flex justify-between items-center gap-1">
      <img src={xlsxIcon} alt="attachment icon" className="inline-block mr-2 size-4" />
      <div>
        <span className="font-semibold text-[#7D7D7D] text-[8pt]">{formatFileName(budgetFile?.name)}</span>
        <div className="flex justify-between text-[7pt]">
          <span>{convertToMb(budgetFile?.size)}</span>
          <span>{formatDate(budgetFile?.lastModifiedDate)}</span>
        </div>
      </div>
    </div>
    <button type="button" className="text-gray-400 cursor-pointer" onClick={removeAttachment}>
      <X size={12} />
    </button>
  </div>
  </>
}