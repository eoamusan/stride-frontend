import axiosInstance from '@/lib/axios';
import { useUserStore } from '@/stores/user-store';

export default class ExpenseService {
  static async create({ data }) {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.post('expense', data, {
      headers: {
        Authorization: `Bearer ${userStore.data?.accessToken}`,
      },
    });
    return response;
  }

  static async get({ id }) {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.get(`expense/${id}`, {
      headers: {
        Authorization: `Bearer ${userStore.data?.accessToken}`,
      },
    });
    return response;
  }

  static async fetch() {
    const userStore = useUserStore.getState();
    const url = 'expense/fetch';

    const response = await axiosInstance.post(
      url,
      { businessId: userStore.businessData?._id },
      {
        headers: {
          Authorization: `Bearer ${userStore.data?.accessToken}`,
        },
      }
    );
    return response;
  }
}
