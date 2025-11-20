import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileText, FileCheck } from 'lucide-react';
import { useState } from 'react';
import regularIcon from '@/assets/icons/regular-invoice-icon.png';
import proformaIcon from '@/assets/icons/proforma-invoice-icon.png';

export default function InvoiceTypeModal({ isOpen, onClose, onSelectType }) {
  const [selectedType, setSelectedType] = useState('proforma');

  const handleNext = () => {
    onSelectType(selectedType);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Create New Invoice</DialogTitle>
          <DialogDescription>
            Choose the type of invoice you want to create
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Proforma Invoice Option */}
          <button
            onClick={() => setSelectedType('proforma')}
            className={`w-full cursor-pointer rounded-2xl p-4 text-left ${
              selectedType === 'proforma'
                ? 'bg-primary'
                : 'hover:bg-primary/10 border border-gray-300 bg-white transition-all'
            }`}
          >
            <div className="flex items-center gap-4">
              <img
                src={proformaIcon}
                alt="Proforma Invoice Icon"
                className="size-10"
              />
              <div className="flex-1">
                <h3
                  className={`text-sm font-semibold ${
                    selectedType === 'proforma' ? 'text-white' : ''
                  }`}
                >
                  Proforma Invoice
                </h3>
                <p
                  className={`mt-1 text-xs ${
                    selectedType === 'proforma'
                      ? 'text-white/90'
                      : 'text-gray-600'
                  }`}
                >
                  Prepare an estimated cost document prior to order confirmation
                </p>
              </div>
            </div>
          </button>

          {/* Regular Invoice Option */}
          <button
            onClick={() => setSelectedType('regular')}
            className={`w-full cursor-pointer rounded-2xl p-4 text-left ${
              selectedType === 'regular'
                ? 'bg-primary'
                : 'hover:bg-primary/10 border border-gray-300 bg-white transition-all'
            }`}
          >
            <div className="flex items-center gap-4">
              <img
                src={regularIcon}
                alt="Regular Invoice Icon"
                className="size-10"
              />
              <div className="flex-1">
                <h3
                  className={`text-sm font-semibold ${
                    selectedType === 'regular' ? 'text-white' : ''
                  }`}
                >
                  Regular Invoice
                </h3>
                <p
                  className={`mt-1 text-sm ${
                    selectedType === 'regular'
                      ? 'text-white/90'
                      : 'text-gray-600'
                  }`}
                >
                  Issue the official invoice required for payment and financial
                  records
                </p>
              </div>
            </div>
          </button>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={handleNext} className="h-12 w-full rounded-2xl">
            Next
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
