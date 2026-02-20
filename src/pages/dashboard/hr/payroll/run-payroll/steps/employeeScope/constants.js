export const EMPLOYEE_PAGE_SIZE = 20;

export const DEFAULT_SCOPE = {
  allEligibleEmployees: true,
  filterByDepartment: false,
  departments: [],
  filterByCadres: false,
  cadres: [],
  specificEmployees: false,
  employees: [],
};

export const EMPLOYEE_IDENTIFIER_KEYS = [
  'employeeId',
  'employee_id',
  'employeeID',
  'staffId',
  'staff_id',
  'staffID',
  'empId',
  'emp_id',
  'employeeCode',
  'employeeNumber',
  'employeeNo',
  'personnelId',
  'personnel_id',
  'id',
  '_id',
];

export const DEPARTMENT_NAME_KEYS = [
  'name',
  'title',
  'departmentName',
  'displayName',
  'label',
];

export const DEPARTMENT_ID_KEYS = [
  'departmentId',
  'department_id',
  'deptId',
  'departmentCode',
  'code',
];

export const CADRE_NAME_KEYS = [
  'name',
  'title',
  'cadreName',
  'displayName',
  'label',
];

export const CADRE_ID_KEYS = [
  'cadreId',
  'cadre_id',
  'gradeId',
  'cadreCode',
  'code',
];
