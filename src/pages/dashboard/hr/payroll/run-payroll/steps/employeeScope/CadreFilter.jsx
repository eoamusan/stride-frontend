import CheckableOption from './CheckableOption';

const CadreFilter = ({
  isLoading,
  isError,
  options,
  selectedIds,
  onToggle,
}) => {
  if (isLoading) {
    return <p className="text-sm text-gray-500">Loading cadres…</p>;
  }

  if (isError) {
    return (
      <p className="text-sm text-red-500">
        Unable to load cadres. Please try again.
      </p>
    );
  }

  if (!options.length) {
    return (
      <p className="text-sm text-gray-500">No cadres found for this account.</p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {options.map((cadre) => (
        <CheckableOption
          key={cadre.id}
          id={cadre.id}
          name={cadre.name}
          count={cadre.count}
          checked={selectedIds.includes(cadre.id)}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
};

export default CadreFilter;
