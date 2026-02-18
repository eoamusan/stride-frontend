import { useUserStore } from '@/stores/user-store';
import { useMutation } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import toast from 'react-hot-toast';

export const useUpdateSalaryComponentMutation = () => {
  const userStore = useUserStore.getState();

  const mutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await axiosInstance.patch(
        `/salary-component/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${userStore.data?.accessToken}`,
          },
        }
      );
      return response.data;
    },
  });

  const updateSalaryComponentHandler = async (id, data, options = {}) => {
    const { onSuccess, onError, showToast = true } = options;

    const payload = {
      componentName: data.componentName,
      componentType: data.type,
      amountType: data.amountType,
      taxableComponent: data.taxable,
      recurringMonthly: data.recurringMonthly,
      accountId: userStore?.data?.accountId,
    };

    await mutation.mutateAsync(
      { id, data: payload },
      {
        onSuccess: (result) => {
          if (onSuccess) {
            onSuccess(result);
          } else if (showToast) {
            toast.success('Salary component updated successfully');
          }
        },
        onError: (error) => {
          const errorMessage =
            error?.response?.data?.message ||
            'Failed to update salary component';
          if (onError) {
            onError(error);
          } else if (showToast) {
            toast.error(errorMessage);
          }
        },
      }
    );
  };

  return {
    isUpdateComponentLoading: mutation.isPending,
    updateSalaryComponentHandler,
  };
};
