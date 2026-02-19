import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import axiosInstance from '@/lib/axios';
import { useUserStore } from '@/stores/user-store';

export const useMarkObligationAsPaidMutation = () => {
  const userStore = useUserStore.getState();

  const mutation = useMutation({
    mutationFn: async (id) => {
      const response = await axiosInstance.patch(
        `/payroll/obligations/${id}/mark-paid`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userStore.data?.accessToken}`,
          },
        }
      );
      return response.data;
    },
  });

  const markObligationAsPaidHandler = async (id, options = {}) => {
    const { onSuccess, onError, showToast = true } = options;

    await mutation.mutateAsync(id, {
      onSuccess: (result) => {
        if (onSuccess) {
          onSuccess(result);
        } else if (showToast) {
          toast.success('Obligation marked as paid');
        }
      },
      onError: (error) => {
        const errorMessage =
          error?.response?.data?.message || 'Failed to mark obligation as paid';
        if (onError) {
          onError(error);
        } else if (showToast) {
          toast.error(errorMessage);
        }
      },
    });
  };

  return {
    isMarkObligationAsPaidLoading: mutation.isPending,
    markObligationAsPaidHandler,
  };
};