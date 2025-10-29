import { useState, useRef, useEffect } from 'react';
import { SlidersHorizontalIcon } from 'lucide-react';
import Coloris from '@melloware/coloris';
import '@melloware/coloris/dist/coloris.css';

const DEFAULT_BRAND_COLORS = [
  '#3B82F6', // Blue
  '#000000', // Black
  '#FFFFFF', // White
  '#FFC107', // Yellow/Amber
  '#FF5722', // Orange
  '#E91E63', // Pink/Magenta
];

export default function ColorPicker({
  selectedColor,
  onColorChange,
  brandColors = DEFAULT_BRAND_COLORS,
  className = '',
  disabled = false,
}) {
  const colorPickerRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize Coloris
  useEffect(() => {
    if (disabled) return;

    // Small delay to prevent conflicts
    const timer = setTimeout(() => {
      try {
        // Initialize Coloris with configuration
        Coloris.init();
        Coloris({
          themeMode: 'polaroid',
          formatToggle: true,
          selectInput: true,
          onChange: (color) => {
            console.log(`Color picker changed to: ${color}`);
            onColorChange?.(color);
          },
        });
        setIsInitialized(true);
      } catch (error) {
        console.error('Coloris initialization error:', error);
      }
    }, 100);

    // Cleanup function
    return () => {
      clearTimeout(timer);
      try {
        Coloris.close();
        setIsInitialized(false);
      } catch (error) {
        console.error('Coloris cleanup error:', error);
      }
    };
  }, [disabled, onColorChange]);

  const handleColorSelect = (color) => {
    if (disabled) return;
    onColorChange?.(color);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <p className="text-sm text-gray-600">Select Color</p>
      <div className="flex items-center gap-3">
        {brandColors.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => handleColorSelect(color)}
            disabled={disabled}
            className={`h-8 w-8 rounded-lg border-2 transition-all ${
              selectedColor === color
                ? 'border-gray-400 ring-2 ring-gray-300 ring-offset-2'
                : 'border-gray-200 hover:border-gray-300'
            } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            style={{ backgroundColor: color }}
          >
            {color === '#FFFFFF' && (
              <div className="h-full w-full rounded-lg border border-gray-200" />
            )}
          </button>
        ))}

        {/* Custom Color Picker */}
        <div
          className={`relative flex h-8 w-8 items-center justify-center rounded-lg border-2 transition-all ${
            !brandColors.includes(selectedColor)
              ? 'border-gray-400 ring-2 ring-gray-300 ring-offset-2'
              : 'border-gray-200 hover:border-gray-300'
          } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
          style={{ backgroundColor: selectedColor }}
        >
          <SlidersHorizontalIcon size={14} className="text-white" />
          {isInitialized && !disabled && (
            <input
              type="text"
              data-coloris
              value={selectedColor}
              ref={colorPickerRef}
              className="absolute bottom-0 left-0 h-[33px] w-[33px] cursor-pointer rounded-full opacity-0"
              readOnly
            />
          )}
        </div>
      </div>
    </div>
  );
}
