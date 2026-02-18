import { useUserStore } from '@/stores/user-store';
import { useMutation } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import toast from 'react-hot-toast';

export const useCreateSalaryComponentMutation = () => {
  const userStore = useUserStore.getState();

  const mutation = useMutation({
    mutationFn: async (payload) => {
      const response = await axiosInstance.post('/salary-component', payload, {
        headers: {
          Authorization: `Bearer ${userStore.data?.accessToken}`,
        },
      });
      return response.data;
    },
  });

  const createSalaryComponentHandler = async (data, options = {}) => {
    const { onSuccess, onError, showToast = true } = options;

    const payload = {
      componentName: data.componentName,
      componentType: data.type,
      amountType: data.amountType,
      taxableComponent: data.taxable,
      recurringMonthly: data.recurringMonthly,
      accountId: userStore?.data?.account?._id,
    };

    await mutation.mutateAsync(payload, {
      onSuccess: (result) => {
        if (onSuccess) {
          onSuccess(result);
        } else if (showToast) {
          toast.success('Salary component created successfully');
        }
      },
      onError: (error) => {
        const errorMessage =
          error?.response?.data?.message || 'Failed to create salary component';
        if (onError) {
          onError(error);
        } else if (showToast) {
          toast.error(errorMessage);
        }
      },
    });
  };

  return {
    isCreateComponentLoading: mutation.isPending,
    createSalaryComponentHandler,
  };
};
