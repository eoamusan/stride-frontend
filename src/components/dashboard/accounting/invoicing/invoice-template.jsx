import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { SlidersHorizontalIcon, ArrowLeftIcon } from 'lucide-react';
import Coloris from '@melloware/coloris';
import '@melloware/coloris/dist/coloris.css';
import { useUserStore } from '@/stores/user-store';

export default function InvoiceTemplateSettings({
  onBack,
  onSave,
  initialTemplate,
  initialColor,
}) {
  const { businessData } = useUserStore();
  const [selectedTemplate, setSelectedTemplate] = useState(
    initialTemplate ? parseInt(initialTemplate) - 1 : 0
  );
  const [selectedColor, setSelectedColor] = useState(
    initialColor ||
      businessData?.businessInvoiceSettings?.brandColor ||
      '#3300C9'
  );
  const colorPickerRef = useRef(null);

  // Predefined brand colors for color picker
  const brandColors = [
    '#3300C9', // Blue
    '#000000', // Black
    '#FFaabb', // White
    '#FFC107', // Yellow/Amber
    '#FF5722', // Orange
    '#E91E63', // Pink/Magenta
  ];

  // Update selected color when business data changes or initial values change
  useEffect(() => {
    if (initialColor) {
      setSelectedColor(initialColor);
    } else if (businessData?.businessInvoiceSettings?.brandColor) {
      setSelectedColor(businessData.businessInvoiceSettings.brandColor);
    }

    // Set template based on initial value or business data
    if (initialTemplate) {
      setSelectedTemplate(parseInt(initialTemplate) - 1 || 0);
    } else if (businessData?.businessInvoiceSettings?.template) {
      setSelectedTemplate(
        parseInt(businessData.businessInvoiceSettings.template) - 1 || 0
      );
    }
  }, [businessData, initialTemplate, initialColor]);

  // Initialize Coloris for custom color picker
  useEffect(() => {
    // Initialize Coloris with configuration
    Coloris.init();
    Coloris({
      themeMode: 'polaroid',
      formatToggle: true,
      selectInput: true,
      onChange: (color, input) => {
        setSelectedColor(color);
      },
    });

    // Cleanup function
    return () => {
      Coloris.close();
    };
  }, []);

  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  const handleSave = () => {
    // Call the parent's save function with the selected values
    onSave?.({ selectedTemplate, selectedColor });
  };

  const handleCancel = () => {
    onBack?.();
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <div className="space-y-8">
        {/* Template Selection */}
        <div>
          <h3 className="mb-4 text-lg font-semibold">Choose Template</h3>
          <div className="flex gap-4">
            <div
              className={`relative w-64 cursor-pointer overflow-hidden rounded-lg border-2 transition-all ${
                selectedTemplate === 0
                  ? 'border-primary ring-primary/20 ring-2'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedTemplate(0)}
            >
              {/* Preview Container */}
              <div className="relative h-52 w-full overflow-hidden bg-white">
                {/* Mini Invoice Preview */}
                <div className="absolute inset-2 rounded border border-gray-100 bg-white p-2 text-xs">
                  {/* Header */}
                  <div className="mb-2 flex items-start justify-between">
                    <div
                      className="h-8 w-8 rounded"
                      style={{ backgroundColor: selectedColor }}
                    ></div>
                    <div className="text-right">
                      <div className="text-[8px] font-bold">INV 3424</div>
                      <div className="text-[6px] text-gray-500">
                        Balance Due
                      </div>
                      <div className="text-[8px] font-bold">₦ 255,000.00</div>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="mb-2">
                    <div className="text-[6px] text-gray-500">Billed To:</div>
                    <div className="text-[7px] font-bold">Dianne Russell</div>
                    <div className="text-[6px] text-gray-400">
                      ABC Corporation
                    </div>
                  </div>

                  {/* Table Header */}
                  <div
                    className="mb-1 rounded-sm p-1 text-[6px] font-semibold text-white"
                    style={{ backgroundColor: selectedColor }}
                  >
                    <div className="grid grid-cols-4 gap-1">
                      <div>Item</div>
                      <div>Qty</div>
                      <div>Rate</div>
                      <div>Amount</div>
                    </div>
                  </div>

                  {/* Table Rows */}
                  <div className="mb-2 space-y-1">
                    <div className="grid grid-cols-4 gap-1 py-1 text-[6px]">
                      <div>UI/UX Design</div>
                      <div>1</div>
                      <div>₦50,000</div>
                      <div>₦50,000</div>
                    </div>
                    <div className="grid grid-cols-4 gap-1 bg-gray-50 py-1 text-[6px]">
                      <div>Web Dev</div>
                      <div>2</div>
                      <div>₦100,000</div>
                      <div>₦200,000</div>
                    </div>
                  </div>

                  {/* Totals */}
                  <div className="space-y-1 border-t pt-1 text-right">
                    <div className="flex justify-between text-[6px]">
                      <span>Sub Total:</span>
                      <span>₦250,000</span>
                    </div>
                    <div className="flex justify-between text-[6px]">
                      <span>VAT (7.5%):</span>
                      <span>₦18,750</span>
                    </div>
                    <div className="flex justify-between border-t pt-1 text-[7px] font-bold">
                      <span>Total:</span>
                      <span>₦268,750</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Brand Color Selection */}
        <div>
          <h3 className="mb-4 text-lg font-semibold">Choose Brand Color</h3>
          <div className="space-y-3">
            <p className="text-sm text-gray-600">Select Color</p>
            <div className="flex items-center gap-3">
              {brandColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleColorSelect(color)}
                  className={`h-8 w-8 rounded-lg border-2 transition-all ${
                    selectedColor === color
                      ? 'border-gray-400 ring-2 ring-gray-300 ring-offset-2'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                >
                  {color === '#FFFFFF' && (
                    <div className="h-full w-full rounded-lg border border-gray-200" />
                  )}
                </button>
              ))}

              {/* Custom Color Picker */}
              <div
                className={`relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border-2 transition-all ${
                  !brandColors.includes(selectedColor)
                    ? 'border-gray-400 ring-2 ring-gray-300 ring-offset-2'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                style={{ backgroundColor: selectedColor }}
              >
                <SlidersHorizontalIcon size={14} className="text-white" />
                <input
                  type="text"
                  data-coloris
                  value={selectedColor}
                  ref={colorPickerRef}
                  className="absolute bottom-0 left-0 h-[33px] w-[33px] cursor-pointer rounded-full opacity-0"
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-6">
          <Button variant="outline" onClick={handleCancel} className="px-8">
            Cancel
          </Button>
          <Button onClick={handleSave} className="px-8">
            Save settings
          </Button>
        </div>
      </div>
    </div>
  );
}
