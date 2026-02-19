import { useState, useEffect, useMemo } from 'react';
import { CustomButton, SearchInput } from '@/components/customs';
import CustomCheckbox from '@/components/customs/checkbox';
import SelectionCard from '@/components/customs/selectionCard';
import { useGetDepartmentsQuery } from '@/hooks/api/useGetDepartmentsQuery';
import { useGetCadresQuery } from '@/hooks/api/useGetCadresQuery';
import { resolveEntityIdentifier } from '@/lib/utils';

const sampleEmployees = [
  {
    id: '1',
    name: 'Nathaniel Desire',
    initials: 'ND',
    role: 'Senior Software Engineer',
    department: 'Engineering',
    empId: '345321231',
  },
  {
    id: '2',
    name: 'Femi Johnson',
    initials: null,
    role: 'Senior Software Engineer',
    department: 'Engineering',
    empId: '345321231',
    avatar: 'https://i.pravatar.cc/40?u=femi',
  },
  {
    id: '3',
    name: 'Sarah Adeyemi',
    initials: null,
    role: 'Senior Software Engineer',
    department: 'Engineering',
    empId: '345321231',
    avatar: 'https://i.pravatar.cc/40?u=sarah',
  },
];

const defaultScope = {
  allEligibleEmployees: true,
  filterByDepartment: false,
  departments: [],
  filterByCadres: false,
  cadres: [],
  specificEmployees: false,
  employees: [],
};

const EmployeeSelection = ({ defaultValues = null, onBack, onNext }) => {
  const totalEmployees = 142;

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

  const deriveInitialMode = (scope) => {
    if (scope?.specificEmployees) return 'specific';
    if (scope?.filterByCadres) return 'cadre';
    if (scope?.filterByDepartment) return 'department';
    return 'all';
  };

  const initialScope = defaultValues || defaultScope;

  const [selectionMode, setSelectionMode] = useState(
    deriveInitialMode(initialScope)
  );
  const [selectedDepartments, setSelectedDepartments] = useState(
    initialScope.departments || []
  );
  const [selectedCadres, setSelectedCadres] = useState(
    initialScope.cadres || []
  );
  const [selectedEmployees, setSelectedEmployees] = useState(
    initialScope.employees || []
  );

  useEffect(() => {
    const scope = defaultValues || defaultScope;
    setSelectionMode(deriveInitialMode(scope));
    setSelectedDepartments(scope.departments || []);
    setSelectedCadres(scope.cadres || []);
    setSelectedEmployees(scope.employees || []);
  }, [defaultValues]);

  const buildScopePayload = () => ({
    allEligibleEmployees: selectionMode === 'all',
    filterByDepartment: selectionMode === 'department',
    departments: selectionMode === 'department' ? selectedDepartments : [],
    filterByCadres: selectionMode === 'cadre',
    cadres: selectionMode === 'cadre' ? selectedCadres : [],
    specificEmployees: selectionMode === 'specific',
    employees: selectionMode === 'specific' ? selectedEmployees : [],
  });

  const getCurrentCount = () => {
    if (selectionMode === 'all') return totalEmployees;
    if (selectionMode === 'department')
      return getAggregatedCount(selectedDepartments, departmentCounts);
    if (selectionMode === 'cadre')
      return getAggregatedCount(selectedCadres, cadreCounts);
    if (selectionMode === 'specific') return selectedEmployees.length;
    return 0;
  };

  const handleDepartmentToggle = (deptId) => {
    setSelectedDepartments((prev) =>
      prev.includes(deptId)
        ? prev.filter((id) => id !== deptId)
        : [...prev, deptId]
    );
  };

  const handleCadreToggle = (cadreId) => {
    setSelectedCadres((prev) =>
      prev.includes(cadreId)
        ? prev.filter((id) => id !== cadreId)
        : [...prev, cadreId]
    );
  };

  const handleEmployeeToggle = (empId) => {
    setSelectedEmployees((prev) =>
      prev.includes(empId)
        ? prev.filter((id) => id !== empId)
        : [...prev, empId]
    );
  };

  const isModeActive = (mode) => selectionMode === mode;

  const handleContinue = () => {
    if (typeof onNext === 'function') {
      onNext(buildScopePayload());
    }
  };

  return (
    <div className="mx-auto space-y-3">
      <div className="space-y-4">
        <SelectionCard
          title="All Eligible Employees"
          description="Include all 142 active employees"
          count={totalEmployees}
          active={isModeActive('all')}
          onClick={() => {
            setSelectionMode('all');
            setSelectedDepartments([]);
            setSelectedCadres([]);
            setSelectedEmployees([]);
          }}
        />

        <SelectionCard
          title="Filter by Department"
          description="Select specific departments to process"
          count={getCurrentCount()}
          active={isModeActive('department')}
          onClick={() => setSelectionMode('department')}
        >
          {isModeActive('department') && (
            <div className="mt-4 space-y-3">
              {isDepartmentsLoading && (
                <p className="text-sm text-gray-500">Loading departments…</p>
              )}

              {!isDepartmentsLoading && isDepartmentsError && (
                <p className="text-sm text-red-500">
                  Unable to load departments. Please try again.
                </p>
              )}

              {!isDepartmentsLoading &&
                !isDepartmentsError &&
                (departmentOptions.length ? (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {departmentOptions.map((dept) => (
                      <label
                        key={dept.id}
                        className="flex cursor-pointer items-center justify-between rounded-lg border border-[#D3D3D380] bg-gray-50 p-3 transition hover:bg-gray-100"
                      >
                        <div className="flex items-center gap-3">
                          <CustomCheckbox
                            checked={selectedDepartments.includes(dept.id)}
                            onChange={() => handleDepartmentToggle(dept.id)}
                            label={dept.name}
                          />
                        </div>

                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D9D9D980] text-sm font-semibold text-gray-500">
                          {Number.isFinite(dept.count) ? dept.count : '—'}
                        </span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    No departments found for this account.
                  </p>
                ))}
            </div>
          )}
        </SelectionCard>

        <SelectionCard
          title="Filter by Cadre"
          description="Select specific cadres to process"
          count={getCurrentCount()}
          active={isModeActive('cadre')}
          onClick={() => setSelectionMode('cadre')}
        >
          {isModeActive('cadre') && (
            <div className="mt-4 space-y-3">
              {isCadresLoading && (
                <p className="text-sm text-gray-500">Loading cadres…</p>
              )}

              {!isCadresLoading && isCadresError && (
                <p className="text-sm text-red-500">
                  Unable to load cadres. Please try again.
                </p>
              )}

              {!isCadresLoading &&
                !isCadresError &&
                (cadreOptions.length ? (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {cadreOptions.map((cadre) => (
                      <label
                        key={cadre.id}
                        className="flex cursor-pointer items-center justify-between rounded-lg border border-[#D3D3D380] bg-gray-50 p-3 transition hover:bg-gray-100"
                      >
                        <div className="flex items-center gap-3">
                          <CustomCheckbox
                            checked={selectedCadres.includes(cadre.id)}
                            onChange={() => handleCadreToggle(cadre.id)}
                            label={cadre.name}
                          />
                        </div>

                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D9D9D980] text-sm font-semibold text-gray-500">
                          {Number.isFinite(cadre.count) ? cadre.count : '—'}
                        </span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    No cadres found for this account.
                  </p>
                ))}
            </div>
          )}
        </SelectionCard>

        <SelectionCard
          title="Specific Employees"
          description="Select individual employees manually"
          count={getCurrentCount()}
          active={isModeActive('specific')}
          onClick={() => setSelectionMode('specific')}
        >
          {isModeActive('specific') && (
            <div className="mt-4 flex flex-col gap-3">
              <SearchInput placeholder="Search employees..." />

              <div className="max-h-80 space-y-2 overflow-y-auto rounded-xl border border-[#E8E8E8] bg-white p-4">
                {sampleEmployees.map((emp) => (
                  <label
                    key={emp.id}
                    className="flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white p-3 transition hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-2">
                      <CustomCheckbox
                        checked={selectedEmployees.includes(emp.id)}
                        onChange={() => handleEmployeeToggle(emp.id)}
                      />

                      {emp.avatar ? (
                        <img
                          src={emp.avatar}
                          alt={emp.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-lg font-semibold text-white">
                          {emp.initials || emp.name[0].toUpperCase()}
                        </div>
                      )}

                      <p className="truncate text-sm font-medium text-black">
                        {emp.name}
                      </p>
                    </div>

                    <p className="truncate text-sm font-medium text-black">
                      {emp.role}
                    </p>

                    <p className="truncate text-sm font-medium text-black">
                      {emp.department}
                    </p>

                    <span className="text-sm font-medium text-black">
                      {emp.empId}
                    </span>
                  </label>
                ))}
              </div>
            </div>
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

const mapEntitiesToOptions = (items, type) => {
  if (!Array.isArray(items)) return [];

  const nameKeys =
    type === 'department'
      ? ['name', 'title', 'departmentName', 'displayName', 'label']
      : ['name', 'title', 'cadreName', 'displayName', 'label'];

  const idKeys =
    type === 'department'
      ? ['departmentId', 'department_id', 'deptId', 'departmentCode', 'code']
      : ['cadreId', 'cadre_id', 'gradeId', 'cadreCode', 'code'];

  return items
    .map((item, index) => {
      const id =
        resolveEntityIdentifier(item, idKeys) ??
        item?.code ??
        `${type}-${index}`;

      const name = nameKeys.reduce(
        (value, key) => value ?? item?.[key],
        undefined
      );

      return {
        id,
        name: name || `Unnamed ${type}`,
        count: extractCount(item),
      };
    })
    .filter((option) => option.id && option.name);
};

const extractCount = (entity) => {
  const candidates = [
    entity?.employeeCount,
    entity?.count,
    entity?.totalEmployees,
    entity?.total,
    entity?.size,
  ];

  for (const candidate of candidates) {
    const value = Number(candidate);
    if (Number.isFinite(value) && value >= 0) return value;
  }

  return undefined;
};

const buildCountLookup = (options) =>
  options.reduce((acc, option) => {
    acc[option.id] = Number.isFinite(option.count) ? option.count : 0;
    return acc;
  }, {});

const getAggregatedCount = (selectedIds, lookup) => {
  if (!selectedIds.length) return 0;
  const total = selectedIds.reduce((sum, id) => sum + (lookup[id] ?? 0), 0);
  return total || selectedIds.length;
};
