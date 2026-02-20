import { CustomButton } from '@/components/customs';
import SelectionCard from '@/components/customs/selectionCard';
import {
  DepartmentFilter,
  CadreFilter,
  SpecificEmployeeSelector,
  useEmployeeSelection,
} from './employeeScope/index.js';

const EmployeeSelection = ({ defaultValues = null, onBack, onNext }) => {
  const {
    // Selection mode
    selectionMode,
    handleModeChange,

    // Department data
    departmentOptions,
    isDepartmentsLoading,
    isDepartmentsError,
    selectedDepartments,
    handleDepartmentToggle,

    // Cadre data
    cadreOptions,
    isCadresLoading,
    isCadresError,
    selectedCadres,
    handleCadreToggle,

    // Employee data
    employeeItems,
    isEmployeesLoading,
    isEmployeesFetching,
    isEmployeesError,
    refetchEmployees,
    selectedEmployeeSet,
    handleEmployeeToggle,

    // Search and pagination
    searchTerm,
    handleSearchChange,
    page,
    handlePreviousPage,
    handleNextPage,
    resetPage,
    paginationMeta,

    // Computed
    totalEmployees,
    allEmployeesDescription,
    getCurrentCount,
    getScopePayload,
  } = useEmployeeSelection(defaultValues);

  const isModeActive = (mode) => selectionMode === mode;

  const handleContinue = () => {
    if (typeof onNext === 'function') {
      onNext(getScopePayload());
    }
  };

  return (
    <div className="mx-auto space-y-3">
      <div className="space-y-4">
        <SelectionCard
          title="All Eligible Employees"
          description={allEmployeesDescription}
          count={totalEmployees}
          active={isModeActive('all')}
          onClick={() => handleModeChange('all')}
        />

        <SelectionCard
          title="Filter by Department"
          description="Select specific departments to process"
          count={getCurrentCount()}
          active={isModeActive('department')}
          onClick={() => handleModeChange('department')}
        >
          {isModeActive('department') && (
            <div className="mt-4 space-y-3">
              <DepartmentFilter
                isLoading={isDepartmentsLoading}
                isError={isDepartmentsError}
                options={departmentOptions}
                selectedIds={selectedDepartments}
                onToggle={handleDepartmentToggle}
              />
            </div>
          )}
        </SelectionCard>

        <SelectionCard
          title="Filter by Cadre"
          description="Select specific cadres to process"
          count={getCurrentCount()}
          active={isModeActive('cadre')}
          onClick={() => handleModeChange('cadre')}
        >
          {isModeActive('cadre') && (
            <div className="mt-4 space-y-3">
              <CadreFilter
                isLoading={isCadresLoading}
                isError={isCadresError}
                options={cadreOptions}
                selectedIds={selectedCadres}
                onToggle={handleCadreToggle}
              />
            </div>
          )}
        </SelectionCard>

        <SelectionCard
          title="Specific Employees"
          description="Select individual employees manually"
          count={getCurrentCount()}
          active={isModeActive('specific')}
          onClick={() => handleModeChange('specific')}
        >
          {isModeActive('specific') && (
            <SpecificEmployeeSelector
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              onResetPage={resetPage}
              employees={employeeItems}
              selectedEmployeeSet={selectedEmployeeSet}
              onToggle={handleEmployeeToggle}
              isLoading={isEmployeesLoading}
              isFetching={isEmployeesFetching}
              isError={isEmployeesError}
              onRetry={refetchEmployees}
              pagination={paginationMeta}
              currentPage={page}
              onPreviousPage={handlePreviousPage}
              onNextPage={handleNextPage}
            />
          )}
        </SelectionCard>
      </div>

      <hr />

      <div className="flex items-center justify-between">
        <CustomButton variant="outline" onClick={() => onBack?.()}>
          Back
        </CustomButton>
        <CustomButton onClick={handleContinue}>Preview</CustomButton>
      </div>
    </div>
  );
};

export default EmployeeSelection;
