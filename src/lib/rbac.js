/**
 * RBAC (Role-Based Access Control) utilities
 * Manages permissions for HR, Line Manager, and Employee roles
 */

export const USER_ROLES = {
  HR: 'HR',
  LINE_MANAGER: 'LINE_MANAGER',
  EMPLOYEE: 'EMPLOYEE',
};

export const PERMISSIONS = {
  // Employee Directory
  VIEW_ALL_EMPLOYEES: 'view_all_employees',
  VIEW_TEAM_EMPLOYEES: 'view_team_employees',
  VIEW_OWN_PROFILE: 'view_own_profile',
  ADD_EMPLOYEE: 'add_employee',
  EDIT_EMPLOYEE: 'edit_employee',
  DELETE_EMPLOYEE: 'delete_employee',
  
  // Attendance & Leave
  VIEW_ALL_ATTENDANCE: 'view_all_attendance',
  VIEW_TEAM_ATTENDANCE: 'view_team_attendance',
  VIEW_OWN_ATTENDANCE: 'view_own_attendance',
  MANAGE_ATTENDANCE: 'manage_attendance',
  APPROVE_LEAVE: 'approve_leave',
  REQUEST_LEAVE: 'request_leave',
};

// Role-Permission mapping
const ROLE_PERMISSIONS = {
  [USER_ROLES.HR]: [
    PERMISSIONS.VIEW_ALL_EMPLOYEES,
    PERMISSIONS.ADD_EMPLOYEE,
    PERMISSIONS.EDIT_EMPLOYEE,
    PERMISSIONS.DELETE_EMPLOYEE,
    PERMISSIONS.VIEW_ALL_ATTENDANCE,
    PERMISSIONS.MANAGE_ATTENDANCE,
    PERMISSIONS.APPROVE_LEAVE,
    PERMISSIONS.REQUEST_LEAVE,
  ],
  [USER_ROLES.LINE_MANAGER]: [
    PERMISSIONS.VIEW_TEAM_EMPLOYEES,
    PERMISSIONS.VIEW_OWN_PROFILE,
    PERMISSIONS.VIEW_TEAM_ATTENDANCE,
    PERMISSIONS.VIEW_OWN_ATTENDANCE,
    PERMISSIONS.APPROVE_LEAVE,
    PERMISSIONS.REQUEST_LEAVE,
  ],
  [USER_ROLES.EMPLOYEE]: [
    PERMISSIONS.VIEW_OWN_PROFILE,
    PERMISSIONS.VIEW_OWN_ATTENDANCE,
    PERMISSIONS.REQUEST_LEAVE,
  ],
};

/**
 * Check if user has a specific permission
 * @param {string} userRole - User's role (HR, LINE_MANAGER, EMPLOYEE)
 * @param {string} permission - Permission to check
 * @returns {boolean}
 */
export function hasPermission(userRole, permission) {
  if (!userRole) return false;
  const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
  return rolePermissions.includes(permission);
}

/**
 * Get user role from profile
 * @param {object} profile - User profile object
 * @returns {string} User role
 */
export function getUserRole(profile) {
  // TODO: Update this based on your actual API response structure
  // Check if role is in profile, activeBusiness, or data
  return (
    profile?.role ||
    profile?.userRole ||
    profile?.position ||
    USER_ROLES.EMPLOYEE // Default to employee
  );
}

/**
 * Check if user can view employee data
 * @param {string} userRole - User's role
 * @param {string} employeeId - ID of employee to view
 * @param {string} currentUserId - Current user's ID
 * @param {array} teamIds - IDs of team members (for line managers)
 * @returns {boolean}
 */
export function canViewEmployee(userRole, employeeId, currentUserId, teamIds = []) {
  if (hasPermission(userRole, PERMISSIONS.VIEW_ALL_EMPLOYEES)) {
    return true; // HR can view all
  }
  
  if (hasPermission(userRole, PERMISSIONS.VIEW_TEAM_EMPLOYEES)) {
    // Line manager can view own profile and team members
    return employeeId === currentUserId || teamIds.includes(employeeId);
  }
  
  if (hasPermission(userRole, PERMISSIONS.VIEW_OWN_PROFILE)) {
    // Employee can only view own profile
    return employeeId === currentUserId;
  }
  
  return false;
}

/**
 * Filter employees based on user role
 * @param {array} employees - List of all employees
 * @param {string} userRole - User's role
 * @param {string} currentUserId - Current user's ID
 * @param {array} teamIds - IDs of team members (for line managers)
 * @returns {array} Filtered employees
 */
export function filterEmployeesByRole(employees, userRole, currentUserId, teamIds = []) {
  if (hasPermission(userRole, PERMISSIONS.VIEW_ALL_EMPLOYEES)) {
    return employees; // HR sees all
  }
  
  if (hasPermission(userRole, PERMISSIONS.VIEW_TEAM_EMPLOYEES)) {
    // Line manager sees own profile and team members
    return employees.filter(
      (emp) => emp.id === currentUserId || teamIds.includes(emp.id)
    );
  }
  
  if (hasPermission(userRole, PERMISSIONS.VIEW_OWN_PROFILE)) {
    // Employee sees only themselves
    return employees.filter((emp) => emp.id === currentUserId);
  }
  
  return [];
}

/**
 * Get page title based on user role
 * @param {string} userRole - User's role
 * @param {string} defaultTitle - Default title
 * @returns {string}
 */
export function getPageTitle(userRole, defaultTitle = 'Employee Directory') {
  if (userRole === USER_ROLES.EMPLOYEE) {
    return 'My Profile';
  }
  if (userRole === USER_ROLES.LINE_MANAGER) {
    return 'My Team';
  }
  return defaultTitle;
}

/**
 * Get page description based on user role
 * @param {string} userRole - User's role
 * @param {string} page - Page name ('directory' or 'attendance')
 * @returns {string}
 */
export function getPageDescription(userRole, page = 'directory') {
  const descriptions = {
    directory: {
      [USER_ROLES.HR]: 'View and manage all employee information',
      [USER_ROLES.LINE_MANAGER]: 'View and manage your team members',
      [USER_ROLES.EMPLOYEE]: 'View and update your profile information',
    },
    attendance: {
      [USER_ROLES.HR]: 'Track and manage attendance for all employees',
      [USER_ROLES.LINE_MANAGER]: 'Track attendance for your team members',
      [USER_ROLES.EMPLOYEE]: 'View your attendance history and clock in/out',
    },
  };
  
  return descriptions[page]?.[userRole] || descriptions[page]?.[USER_ROLES.EMPLOYEE];
}
