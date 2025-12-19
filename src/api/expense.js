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

  static async fetch({ graph } = {}) {
    const userStore = useUserStore.getState();
    const url = 'expense/fetch';

    const body = { businessId: userStore.businessData?._id };
    if (graph) {
      body.graph = graph;
    }

    const response = await axiosInstance.post(url, body, {
      headers: {
        Authorization: `Bearer ${userStore.data?.accessToken}`,
      },
    });
    return response;
  }
}
