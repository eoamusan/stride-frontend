import CustomCheckbox from '@/components/customs/checkbox';

const EmployeeListItem = ({ employee, isSelected, onToggle }) => {
  const { id, name, role, department, code, avatar, initials } = employee;

  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white p-3 transition hover:bg-gray-50">
      <div className="flex flex-1 items-center gap-3">
        <CustomCheckbox checked={isSelected} onChange={() => onToggle(id)} />

        {avatar ? (
          <img
            src={avatar}
            alt={name}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-lg font-semibold text-white">
            {initials || name[0]?.toUpperCase() || '—'}
          </div>
        )}

        <div className="flex flex-col">
          <p className="max-w-[180px] truncate text-sm font-medium text-black">
            {name}
          </p>
          <span className="text-xs text-gray-500">{role || '—'}</span>
        </div>
      </div>

      <div className="hidden flex-col text-right text-sm font-medium text-black sm:flex">
        <span className="truncate">{department || '—'}</span>
        <span className="text-xs text-gray-500">{code}</span>
      </div>
    </label>
  );
};

export default EmployeeListItem;
