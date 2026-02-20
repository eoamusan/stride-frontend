import CheckableOption from './CheckableOption';

const DepartmentFilter = ({
  isLoading,
  isError,
  options,
  selectedIds,
  onToggle,
}) => {
  if (isLoading) {
    return <p className="text-sm text-gray-500">Loading departments…</p>;
  }

  if (isError) {
    return (
      <p className="text-sm text-red-500">
        Unable to load departments. Please try again.
      </p>
    );
  }

  if (!options.length) {
    return (
      <p className="text-sm text-gray-500">
        No departments found for this account.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {options.map((dept) => (
        <CheckableOption
          key={dept.id}
          id={dept.id}
          name={dept.name}
          count={dept.count}
          checked={selectedIds.includes(dept.id)}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
};

export default DepartmentFilter;
