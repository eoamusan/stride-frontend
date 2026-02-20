import { resolveEntityIdentifier } from '@/lib/utils';
import {
  EMPLOYEE_IDENTIFIER_KEYS,
  DEPARTMENT_NAME_KEYS,
  DEPARTMENT_ID_KEYS,
  CADRE_NAME_KEYS,
  CADRE_ID_KEYS,
} from './constants';

/**
 * Extracts a count value from an entity object
 */
export const extractCount = (entity) => {
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

/**
 * Maps department or cadre entities to selection options
 */
export const mapEntitiesToOptions = (items, type) => {
  if (!Array.isArray(items)) return [];

  const nameKeys =
    type === 'department' ? DEPARTMENT_NAME_KEYS : CADRE_NAME_KEYS;
  const idKeys = type === 'department' ? DEPARTMENT_ID_KEYS : CADRE_ID_KEYS;

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

/**
 * Builds a lookup map of id -> count for quick aggregation
 */
export const buildCountLookup = (options) =>
  options.reduce((acc, option) => {
    acc[option.id] = Number.isFinite(option.count) ? option.count : 0;
    return acc;
  }, {});

/**
 * Calculates total count for selected ids from a lookup
 */
export const getAggregatedCount = (selectedIds, lookup) => {
  if (!selectedIds.length) return 0;
  const total = selectedIds.reduce((sum, id) => sum + (lookup[id] ?? 0), 0);
  return total || selectedIds.length;
};

/**
 * Extracts employee name from various possible field names
 */
export const extractEmployeeName = (employee) => {
  if (!employee) return '';
  const first =
    employee?.firstName ?? employee?.first_name ?? employee?.firstname ?? '';
  const middle = employee?.middleName ?? employee?.middle_name ?? '';
  const last =
    employee?.lastName ?? employee?.last_name ?? employee?.lastname ?? '';

  const parts = [first, middle, last]
    .map((part) => (typeof part === 'string' ? part.trim() : ''))
    .filter(Boolean);

  if (parts.length) return parts.join(' ');

  return (
    employee?.fullName ??
    employee?.name ??
    employee?.displayName ??
    employee?.employeeName ??
    ''
  );
};

/**
 * Builds initials from a full name string
 */
export const buildInitialsFromName = (name) => {
  if (!name || typeof name !== 'string') return '';
  const segments = name
    .split(/\s+/)
    .filter((segment) => segment && segment.trim().length > 0);

  if (!segments.length) return '';

  const initials = segments
    .slice(0, 2)
    .map((segment) => segment.charAt(0).toUpperCase())
    .join('');

  return initials || segments[0].charAt(0).toUpperCase();
};

/**
 * Formats employee code from various possible field names
 */
export const formatEmployeeCode = (employee, fallback) => {
  const candidates = [
    employee?.employeeNumber,
    employee?.employeeNo,
    employee?.employeeCode,
    employee?.staffId,
    employee?.staffNumber,
    employee?.payrollId,
    employee?.empId,
    employee?.employeeId,
  ];

  for (const candidate of candidates) {
    if (candidate === undefined || candidate === null) continue;
    if (typeof candidate === 'string' && candidate.trim()) return candidate;
    if (typeof candidate === 'number') return candidate.toString();
  }

  return fallback;
};

/**
 * Maps raw employee data to selection-friendly format
 */
export const mapEmployeesForSelection = (items) => {
  if (!Array.isArray(items)) return [];

  return items
    .map((employee, index) => {
      const id =
        resolveEntityIdentifier(employee, EMPLOYEE_IDENTIFIER_KEYS) ??
        (employee?.empId ? String(employee.empId) : `employee-${index}`);
      if (!id) return null;

      const name = extractEmployeeName(employee) || `Employee ${index + 1}`;
      const role =
        employee?.jobTitle ??
        employee?.job_title ??
        employee?.role ??
        employee?.position ??
        employee?.title ??
        '';
      const department =
        employee?.department?.name ??
        employee?.departmentName ??
        employee?.department ??
        employee?.team ??
        employee?.unit ??
        '';
      const code = formatEmployeeCode(employee, id);
      const avatar =
        employee?.avatar ??
        employee?.profileImage ??
        employee?.photo ??
        employee?.image ??
        null;
      const initials =
        employee?.initials ??
        buildInitialsFromName(name) ??
        (typeof name === 'string' && name ? name.charAt(0).toUpperCase() : '');

      return {
        id: id.toString(),
        name,
        role,
        department,
        code,
        avatar,
        initials,
      };
    })
    .filter((item) => item && item.id);
};

/**
 * Extracts a normalized employee ID from various input types
 */
export const extractEmployeeId = (entry) => {
  if (entry === undefined || entry === null) return null;
  if (typeof entry === 'string' || typeof entry === 'number') {
    return entry.toString();
  }

  if (typeof entry === 'object') {
    const resolved = resolveEntityIdentifier(entry, EMPLOYEE_IDENTIFIER_KEYS);
    return resolved ? resolved.toString() : null;
  }

  return null;
};

/**
 * Normalizes an array of employee selections to unique string IDs
 */
export const normalizeEmployeeSelections = (values) => {
  if (!Array.isArray(values)) return [];
  const normalized = values
    .map((value) => extractEmployeeId(value))
    .filter(Boolean);

  return Array.from(new Set(normalized));
};

/**
 * Derives the initial selection mode from a scope object
 */
export const deriveInitialMode = (scope) => {
  if (scope?.specificEmployees) return 'specific';
  if (scope?.filterByCadres) return 'cadre';
  if (scope?.filterByDepartment) return 'department';
  return 'all';
};

/**
 * Builds the scope payload for the payroll API
 */
export const buildScopePayload = (
  selectionMode,
  selectedDepartments,
  selectedCadres,
  selectedEmployees
) => ({
  allEligibleEmployees: selectionMode === 'all',
  filterByDepartment: selectionMode === 'department',
  departments: selectionMode === 'department' ? selectedDepartments : [],
  filterByCadres: selectionMode === 'cadre',
  cadres: selectionMode === 'cadre' ? selectedCadres : [],
  specificEmployees: selectionMode === 'specific',
  employees:
    selectionMode === 'specific'
      ? normalizeEmployeeSelections(selectedEmployees)
      : [],
});
