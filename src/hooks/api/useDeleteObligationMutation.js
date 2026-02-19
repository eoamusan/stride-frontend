import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import axiosInstance from '@/lib/axios';
import { useUserStore } from '@/stores/user-store';

export const useDeleteObligationMutation = () => {
  const userStore = useUserStore.getState();

  const mutation = useMutation({
    mutationFn: async (id) => {
      const response = await axiosInstance.delete(
        `/payroll/obligations/${id}`,
        {
          headers: {
            Authorization: `Bearer ${userStore.data?.accessToken}`,
          },
        }
      );
      return response.data;
    },
  });

  const deleteObligationHandler = async (id, options = {}) => {
    const { onSuccess, onError, showToast = true } = options;

    await mutation.mutateAsync(id, {
      onSuccess: (result) => {
        if (showToast) {
          toast.success('Obligation deleted successfully');
        }

        if (onSuccess) {
          onSuccess(result);
        }
      },
      onError: (error) => {
        const errorMessage =
          error?.response?.data?.message || 'Failed to delete obligation';

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
    isDeleteObligationLoading: mutation.isPending,
    deleteObligationHandler,
  };
};
