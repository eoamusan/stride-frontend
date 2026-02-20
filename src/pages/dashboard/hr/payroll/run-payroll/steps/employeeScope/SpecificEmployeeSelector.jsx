import { SearchInput } from '@/components/customs';
import EmployeeListItem from './EmployeeListItem';
import SimplePagination from './SimplePagination';

const SpecificEmployeeSelector = ({
  searchTerm,
  onSearchChange,
  onResetPage,
  employees,
  selectedEmployeeSet,
  onToggle,
  isLoading,
  isFetching,
  isError,
  onRetry,
  pagination,
  currentPage,
  onPreviousPage,
  onNextPage,
}) => {
  const hasEmployees = employees.length > 0;

  return (
    <div className="mt-4 flex flex-col gap-3">
      <SearchInput
        placeholder="Search employees..."
        value={searchTerm}
        onValueChange={onSearchChange}
        resetPageOnChange
        onResetPage={onResetPage}
        className="w-full rounded-xl py-4 pr-4 pl-10"
      />

      <div className="relative max-h-80 space-y-2 overflow-y-auto rounded-xl border border-[#E8E8E8] bg-white p-4">
        {isError ? (
          <ErrorState onRetry={onRetry} />
        ) : isLoading && !hasEmployees ? (
          <LoadingState />
        ) : hasEmployees ? (
          <EmployeeList
            employees={employees}
            selectedEmployeeSet={selectedEmployeeSet}
            onToggle={onToggle}
          />
        ) : (
          <EmptyState />
        )}

        {isFetching && hasEmployees && (
          <p className="text-xs text-gray-400">Updating results…</p>
        )}
      </div>

      <SimplePagination
        currentPage={pagination?.page ?? currentPage}
        totalPages={pagination?.totalPages}
        onPrevious={onPreviousPage}
        onNext={onNextPage}
      />
    </div>
  );
};

const ErrorState = ({ onRetry }) => (
  <div className="space-y-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
    <p>Unable to load employees. Please try again.</p>
    <button
      type="button"
      className="text-xs font-semibold text-red-700 underline"
      onClick={onRetry}
    >
      Retry
    </button>
  </div>
);

const LoadingState = () => (
  <p className="text-sm text-gray-500">Loading employees…</p>
);

const EmptyState = () => (
  <p className="text-sm text-gray-500">No employees match this search.</p>
);

const EmployeeList = ({ employees, selectedEmployeeSet, onToggle }) => (
  <>
    {employees.map((emp) => (
      <EmployeeListItem
        key={emp.id}
        employee={emp}
        isSelected={selectedEmployeeSet.has(emp.id)}
        onToggle={onToggle}
      />
    ))}
  </>
);

export default SpecificEmployeeSelector;
