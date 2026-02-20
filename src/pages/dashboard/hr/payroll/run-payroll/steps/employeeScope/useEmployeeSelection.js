import { useState, useEffect, useMemo, useCallback } from 'react';
import { useGetDepartmentsQuery } from '@/hooks/api/useGetDepartmentsQuery';
import { useGetCadresQuery } from '@/hooks/api/useGetCadresQuery';
import { useGetAllEmployeeQuery } from '@/hooks/api/useGetAllEmployeeQuery';
import useDebounce from '@/hooks/useDebounce';
import {
  DEFAULT_SCOPE,
  EMPLOYEE_PAGE_SIZE,
  mapEntitiesToOptions,
  mapEmployeesForSelection,
  normalizeEmployeeSelections,
  extractEmployeeId,
  deriveInitialMode,
  buildScopePayload,
  buildCountLookup,
  getAggregatedCount,
} from './index';

export const useEmployeeSelection = (defaultValues = null) => {
  // Data fetching hooks
  const {
    departments: departmentData = [],
    isLoading: isDepartmentsLoading,
    isError: isDepartmentsError,
  } = useGetDepartmentsQuery();

  const {
    cadres: cadreData = [],
    isLoading: isCadresLoading,
    isError: isCadresError,
  } = useGetCadresQuery();

  // Employee search and pagination state
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(searchTerm, 400);

  const {
    employees: employeeData = [],
    pagination: employeePagination,
    isLoading: isEmployeesLoading,
    isFetching: isEmployeesFetching,
    isError: isEmployeesError,
    refetch: refetchEmployees,
  } = useGetAllEmployeeQuery({
    search: debouncedSearch,
    page,
    perPage: EMPLOYEE_PAGE_SIZE,
  });

  // Memoized transformations
  const paginationMeta = employeePagination || {
    page: 1,
    perPage: EMPLOYEE_PAGE_SIZE,
    totalPages: 1,
    totalDocs: 0,
  };

  const employeeItems = useMemo(
    () => mapEmployeesForSelection(employeeData),
    [employeeData]
  );

  const totalEmployees =
    paginationMeta?.totalDocs ??
    (Array.isArray(employeeItems) ? employeeItems.length : 0);

  const departmentOptions = useMemo(
    () => mapEntitiesToOptions(departmentData, 'department'),
    [departmentData]
  );

  const cadreOptions = useMemo(
    () => mapEntitiesToOptions(cadreData, 'cadre'),
    [cadreData]
  );

  const departmentCounts = useMemo(
    () => buildCountLookup(departmentOptions),
    [departmentOptions]
  );

  const cadreCounts = useMemo(
    () => buildCountLookup(cadreOptions),
    [cadreOptions]
  );

  // Selection state
  const initialScope = defaultValues || DEFAULT_SCOPE;

  const [selectionMode, setSelectionMode] = useState(
    deriveInitialMode(initialScope)
  );
  const [selectedDepartments, setSelectedDepartments] = useState(
    initialScope.departments || []
  );
  const [selectedCadres, setSelectedCadres] = useState(
    initialScope.cadres || []
  );
  const [selectedEmployees, setSelectedEmployees] = useState(() =>
    normalizeEmployeeSelections(initialScope.employees)
  );

  const selectedEmployeeSet = useMemo(
    () => new Set(selectedEmployees),
    [selectedEmployees]
  );

  // Keep page within bounds
  useEffect(() => {
    const resolvedTotalPages = Math.max(
      1,
      Number(paginationMeta?.totalPages) || 1
    );
    if (page > resolvedTotalPages) {
      setPage(resolvedTotalPages);
    }
  }, [page, paginationMeta?.totalPages]);

  // Sync with default values
  useEffect(() => {
    const scope = defaultValues || DEFAULT_SCOPE;
    setSelectionMode(deriveInitialMode(scope));
    setSelectedDepartments(scope.departments || []);
    setSelectedCadres(scope.cadres || []);
    setSelectedEmployees(normalizeEmployeeSelections(scope.employees));
  }, [defaultValues]);

  // Handlers
  const resetAllSelections = useCallback(() => {
    setSelectedDepartments([]);
    setSelectedCadres([]);
    setSelectedEmployees([]);
  }, []);

  const handleModeChange = useCallback(
    (mode) => {
      setSelectionMode(mode);
      if (mode === 'all') {
        resetAllSelections();
      }
    },
    [resetAllSelections]
  );

  const handleDepartmentToggle = useCallback((deptId) => {
    setSelectedDepartments((prev) =>
      prev.includes(deptId)
        ? prev.filter((id) => id !== deptId)
        : [...prev, deptId]
    );
  }, []);

  const handleCadreToggle = useCallback((cadreId) => {
    setSelectedCadres((prev) =>
      prev.includes(cadreId)
        ? prev.filter((id) => id !== cadreId)
        : [...prev, cadreId]
    );
  }, []);

  const handleEmployeeToggle = useCallback((empId) => {
    const resolvedId = extractEmployeeId(empId);
    if (!resolvedId) return;

    setSelectedEmployees((prev) =>
      prev.includes(resolvedId)
        ? prev.filter((id) => id !== resolvedId)
        : [...prev, resolvedId]
    );
  }, []);

  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
  }, []);

  const handlePageChange = useCallback((newPage) => {
    setPage(newPage);
  }, []);

  const handlePreviousPage = useCallback(() => {
    setPage((prev) => Math.max(1, prev - 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setPage((prev) =>
      Math.min(prev + 1, paginationMeta?.totalPages || prev + 1)
    );
  }, [paginationMeta?.totalPages]);

  const resetPage = useCallback(() => {
    setPage(1);
  }, []);

  // Computed values
  const getCurrentCount = useCallback(() => {
    if (selectionMode === 'all') return totalEmployees;
    if (selectionMode === 'department')
      return getAggregatedCount(selectedDepartments, departmentCounts);
    if (selectionMode === 'cadre')
      return getAggregatedCount(selectedCadres, cadreCounts);
    if (selectionMode === 'specific') return selectedEmployees.length;
    return 0;
  }, [
    selectionMode,
    totalEmployees,
    selectedDepartments,
    departmentCounts,
    selectedCadres,
    cadreCounts,
    selectedEmployees.length,
  ]);

  const getScopePayload = useCallback(
    () =>
      buildScopePayload(
        selectionMode,
        selectedDepartments,
        selectedCadres,
        selectedEmployees
      ),
    [selectionMode, selectedDepartments, selectedCadres, selectedEmployees]
  );

  const allEmployeesDescription =
    totalEmployees > 0
      ? `Include all ${totalEmployees} active employees`
      : 'Include all active employees';

  return {
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
    handlePageChange,
    handlePreviousPage,
    handleNextPage,
    resetPage,
    paginationMeta,

    // Computed
    totalEmployees,
    allEmployeesDescription,
    getCurrentCount,
    getScopePayload,
  };
};
