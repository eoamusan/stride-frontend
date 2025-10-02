import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Truck, InfoIcon } from 'lucide-react';
import { DialogDescription } from '@radix-ui/react-dialog';

export default function ViewMovementModal({
  open,
  onOpenChange,
  movementData = {
    productName: 'Fresh Product',
    quantityToMove: 12,
    fromLocation: 'Warehouse A - Main Floor',
    toLocation: 'Retail Floor - Front Section',
    reasonForMovement: 'Department Transfer',
    status: 'Completed',
    movedBy: 'John Doe',
    dateOfMovement: '9/9/2025 5:08:25 PM',
  },
  onEdit,
  onExport,
}) {
  const handleEdit = () => {
    if (onEdit) {
      onEdit(movementData);
    }
  };

  const handleExport = () => {
    if (onExport) {
      onExport(movementData);
    }
    console.log('Export movement data for:', movementData.productName);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-[90%] sm:max-w-2xl">
        {/* Header */}
        <DialogHeader className="flex-row gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#254C00]">
            <Truck className="size-4 text-white" />
          </div>
          <div className="space-y-2">
            <DialogTitle>View Inventory Movement</DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              View transfers between locations, departments, or warehouses
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="mt-8 space-y-8">
          {/* Movement Details Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Product Name */}
            <div className="flex flex-col gap-1 text-[#434343]">
              <label className="text-sm font-bold">Product Name</label>
              <div className="text-sm font-medium">
                {movementData.productName}
              </div>
            </div>

            {/* Quantity to Move */}
            <div className="flex flex-col gap-1 text-[#434343]">
              <label className="text-sm font-bold">Quantity to Move</label>
              <div className="text-sm font-medium">
                {movementData.quantityToMove}
              </div>
            </div>

            {/* From Location */}
            <div className="flex flex-col gap-1 text-[#434343]">
              <label className="text-sm font-bold">From Location</label>
              <div className="text-sm font-medium">
                {movementData.fromLocation}
              </div>
            </div>

            {/* To Location */}
            <div className="flex flex-col gap-1 text-[#434343]">
              <label className="text-sm font-bold">To Location</label>
              <div className="text-sm font-medium">
                {movementData.toLocation}
              </div>
            </div>

            {/* Reason for Movement */}
            <div className="flex flex-col gap-1 text-[#434343]">
              <label className="text-sm font-bold">Reason for Movement</label>
              <div className="text-sm font-medium">
                {movementData.reasonForMovement}
              </div>
            </div>

            {/* Status */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-bold text-[#434343]">Status</label>
              <div>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800 hover:bg-green-100"
                >
                  {movementData.status}
                </Badge>
              </div>
            </div>
          </div>

          {/* Movement Information Section */}
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="mb-3 flex items-center gap-2">
              <div className="bg-primary flex h-6 w-6 items-center justify-center rounded-full text-white">
                <InfoIcon className="h-3 w-3" />
              </div>
              <h3 className="text-primary text-sm font-semibold">
                Movement Information
              </h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">
                  Moved By:
                </span>
                <span className="text-primary text-sm">john Doe</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">
                  Date of Movement:
                </span>
                <span className="text-primary text-sm">
                  9/9/2025 5:08:25 PM
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 mb-4 flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange?.(false)}
            className="min-w-[120px] rounded-full"
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={handleEdit}
            className="min-w-[120px] rounded-full"
          >
            Edit
          </Button>
          <Button onClick={handleExport} className="min-w-[120px] rounded-full">
            Export
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
