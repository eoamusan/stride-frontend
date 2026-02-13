import React from 'react';

import CheckedIcon from '@/assets/icons/check.svg';

const CustomCheckbox = ({
  checked,
  onChange,
  label,
  className = '',
  ...props
}) => {
  return (
    <label
      className={`flex cursor-pointer items-center select-none ${className}`}
      {...props}
    >
      <div className="relative flex items-center justify-center">
        {/* The box itself */}
        <div
          className={`flex h-6 w-6 items-center justify-center rounded-md border transition-all duration-150 ${
            checked
              ? 'border-[#7F56D9] bg-[#F9F5FF]'
              : 'border-gray-300 bg-white hover:border-gray-400'
          } `}
        >
          {/* Checkmark - only shown when checked */}
          {checked && <img src={CheckedIcon} alt="check" />}
        </div>

        {/* Optional label text */}
        {label && (
          <span className="ml-3 font-semibold text-xs text-gray-800">{label}</span>
        )}
      </div>

      {/* Hidden native checkbox for accessibility & form handling */}
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={onChange}
      />
    </label>
  );
};

export default CustomCheckbox;
