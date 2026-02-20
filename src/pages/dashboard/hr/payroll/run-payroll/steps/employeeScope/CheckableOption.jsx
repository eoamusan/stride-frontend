import CustomCheckbox from '@/components/customs/checkbox';

const CheckableOption = ({ id, name, count, checked, onToggle }) => {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-lg border border-[#D3D3D380] bg-gray-50 p-3 transition hover:bg-gray-100">
      <div className="flex items-center gap-3">
        <CustomCheckbox
          checked={checked}
          onChange={() => onToggle(id)}
          label={name}
        />
      </div>

      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D9D9D980] text-sm font-semibold text-gray-500">
        {Number.isFinite(count) ? count : '—'}
      </span>
    </label>
  );
};

export default CheckableOption;
