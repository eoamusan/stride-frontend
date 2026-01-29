import axiosInstance from '@/lib/axios';
import { useUserStore } from '@/stores/user-store';

export default class BudgetService {
  static async create({ data }) {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.post('budget', data, {
      headers: {
        Authorization: `Bearer ${userStore.data?.accessToken}`,
      },
    });
    return response;
  }

  static async update({ data, id }) {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.patch(`budget/${id}`, data, {
      headers: {
        Authorization: `Bearer ${userStore.data?.accessToken}`,
      },
    });
    return response;
  }

  static async get({ id }) {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.get(`budget/${id}`, {
      headers: {
        Authorization: `Bearer ${userStore.data?.accessToken}`,
      },
    });
    return response;
  }

  static async fetch() {
    const userStore = useUserStore.getState();
    const url = 'budget/fetch';

    const body = { businessId: userStore.activeBusiness?._id };

    const response = await axiosInstance.post(url, body, {
      headers: {
        Authorization: `Bearer ${userStore.data?.accessToken}`,
      },
    });
    return response;
  }

  static async analytics() {
    const userStore = useUserStore.getState();
    const url = 'budget/analytics';

    const body = { businessId: userStore.activeBusiness?._id };

    const response = await axiosInstance.post(url, body, {
      headers: {
        Authorization: `Bearer ${userStore.data?.accessToken}`,
      },
    });
    return response;
  }
}
