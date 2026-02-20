import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import axiosInstance from '@/lib/axios';
import { useUserStore } from '@/stores/user-store';

export const useCreateObligationMutation = () => {
  const userStore = useUserStore.getState();

  const mutation = useMutation({
    mutationFn: async (payload) => {
      const response = await axiosInstance.post(
        '/payroll/obligations',
        payload,
        {
          headers: {
            Authorization: `Bearer ${userStore.data?.accessToken}`,
          },
        }
      );
      return response.data;
    },
  });

  const createObligationHandler = async (data, options = {}) => {
    const { onSuccess, onError, showToast = true } = options;

    const payload = {
      accountId:
        data?.accountId ??
        userStore?.data?.account?._id ??
        userStore?.data?.accountId,
      obligationName: data?.obligationName,
      obligationType: data?.obligationType,
      period: data?.period,
      dueDate:
        data?.dueDate instanceof Date
          ? data.dueDate.toISOString()
          : data?.dueDate,
      amount: data?.amount,
    };

    await mutation.mutateAsync(payload, {
      onSuccess: (result) => {
        if (showToast) {
          toast.success('Obligation created successfully');
        }
        if (onSuccess) {
          onSuccess(result);
        }
      },
      onError: (error) => {
        const errorMessage =
          error?.response?.data?.message || 'Failed to create obligation';
        if (showToast) {
          toast.error(errorMessage);
        }
        if (onError) {
          onError(error);
        }
      },
    });
  };

  return {
    isCreateObligationLoading: mutation.isPending,
    createObligationHandler,
  };
};
