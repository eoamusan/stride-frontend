import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import axiosInstance from '@/lib/axios';
import { useUserStore } from '@/stores/user-store';

export const useUpdateObligationMutation = () => {
  const userStore = useUserStore.getState();

  const mutation = useMutation({
    mutationFn: async ({ id, payload }) => {
      const response = await axiosInstance.patch(
        `/payroll/obligations/${id}`,
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

  const updateObligationHandler = async (id, data, options = {}) => {
    const { onSuccess, onError, showToast = true } = options;

    const payload = {
      obligationName: data?.obligationName,
      obligationType: data?.obligationType,
      period: data?.period,
      dueDate:
        data?.dueDate instanceof Date
          ? data.dueDate.toISOString()
          : data?.dueDate,
      amount: data?.amount,
      status: data?.status,
    };

    await mutation.mutateAsync(
      { id, payload },
      {
        onSuccess: (result) => {
          if (showToast) {
            toast.success('Obligation updated successfully');
          }
          if (onSuccess) {
            onSuccess(result);
          }
        },
        onError: (error) => {
          const errorMessage =
            error?.response?.data?.message || 'Failed to update obligation';
          if (showToast) {
            toast.error(errorMessage);
          }
          if (onError) {
            onError(error);
          }
        },
      }
    );
  };

  return {
    isUpdateObligationLoading: mutation.isPending,
    updateObligationHandler,
  };
};
