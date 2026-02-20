import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import axiosInstance from '@/lib/axios';
import { useUserStore } from '@/stores/user-store';

export const useCreatePayrollMutation = () => {
  const userStore = useUserStore.getState();

  const mutation = useMutation({
    mutationFn: async (payload) => {
      const response = await axiosInstance.post('/payroll/run', payload, {
        headers: {
          Authorization: `Bearer ${userStore.data?.accessToken}`,
        },
      });
      return response.data;
    },
  });

  const createPayrollHandler = async (data, options = {}) => {
    const { onSuccess, onError, showToast = true } = options;

    const resolvedAccountId =
      data?.accountId ??
      userStore?.data?.account?._id ??
      userStore?.data?.accountId ??
      userStore?.activeBusiness?.accountId ??
      null;

    const payload = {
      accountId: resolvedAccountId,
      runPayroll: {
        month: data?.runPayroll?.month ?? '',
        year: data?.runPayroll?.year ?? '',
        payrollType: data?.runPayroll?.payrollType ?? '',
        payrollDate: data?.runPayroll?.payrollDate ?? null,
      },
      employeeScope: {
        allEligibleEmployees:
          data?.employeeScope?.allEligibleEmployees ?? false,
        filterByDepartment: data?.employeeScope?.filterByDepartment ?? false,
        departments: data?.employeeScope?.departments ?? [],
        filterByCadres: data?.employeeScope?.filterByCadres ?? false,
        cadres: data?.employeeScope?.cadres ?? [],
        specificEmployees: data?.employeeScope?.specificEmployees ?? false,
        employees: data?.employeeScope?.employees ?? [],
      },
    };

    await mutation.mutateAsync(payload, {
      onSuccess: (result) => {
        if (onSuccess) {
          onSuccess(result);
        } else if (showToast) {
          toast.success('Payroll run started successfully');
        }
      },
      onError: (error) => {
        const errorMessage =
          error?.response?.data?.message || 'Failed to run payroll';
        if (onError) {
          onError(error);
        } else if (showToast) {
          toast.error(errorMessage);
        }
      },
    });
  };

  return {
    isCreatePayrollLoading: mutation.isPending,
    createPayrollHandler,
  };
};
