import { useMemo } from 'react';
import { useUserStore } from '@/stores/user-store';
import {
  getUserRole,
  hasPermission,
  canViewEmployee,
  filterEmployeesByRole,
  getPageTitle,
  getPageDescription,
  USER_ROLES,
  PERMISSIONS,
} from '@/lib/rbac';

/**
 * Custom hook for RBAC (Role-Based Access Control)
 * Provides easy access to permissions and role-based utilities
 */
export function useRBAC() {
  const { profile, data } = useUserStore();

  const userRole = useMemo(() => {
    // TODO: Update based on your API structure
    // Check multiple possible locations for role information
    return (
      profile?.role ||
      profile?.userRole ||
      data?.role ||
      data?.account?.role ||
      USER_ROLES.EMPLOYEE // Default to employee if no role found
    );
  }, [profile, data]);

  const currentUserId = useMemo(() => {
    return profile?.id || profile?._id || data?.account?._id || null;
  }, [profile, data]);

  // Get team member IDs for line managers
  const teamMemberIds = useMemo(() => {
    // TODO: Update based on your API structure
    return profile?.teamMembers || profile?.managedEmployees || [];
  }, [profile]);

  return {
    userRole,
    currentUserId,
    teamMemberIds,
    isHR: userRole === USER_ROLES.HR,
    isLineManager: userRole === USER_ROLES.LINE_MANAGER,
    isEmployee: userRole === USER_ROLES.EMPLOYEE,

    // Permission checkers
    can: (permission) => hasPermission(userRole, permission),
    canViewEmployee: (employeeId) =>
      canViewEmployee(userRole, employeeId, currentUserId, teamMemberIds),
    
    // Filters
    filterEmployees: (employees) =>
      filterEmployeesByRole(employees, userRole, currentUserId, teamMemberIds),
    
    // UI helpers
    getPageTitle: (defaultTitle) => getPageTitle(userRole, defaultTitle),
    getPageDescription: (page) => getPageDescription(userRole, page),

    // Export constants for use in components
    ROLES: USER_ROLES,
    PERMISSIONS,
  };
}
