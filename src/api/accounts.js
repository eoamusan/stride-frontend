import axiosInstance from '@/lib/axios';
import { useUserStore } from '@/stores/user-store';

export default class AccountService {
  static async create({ data }) {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.post('accounting/account', data, {
      headers: {
        Authorization: `Bearer ${userStore.data?.accessToken}`,
      },
    });
    return response;
  }

  static async get({ id }) {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.get(`accounting/account/${id}`, {
      headers: {
        Authorization: `Bearer ${userStore.data?.accessToken}`,
      },
    });
    return response;
  }

  static async update({ id, data }) {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.patch(
      `accounting/account/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${userStore.data?.accessToken}`,
        },
      }
    );
    return response;
  }

  static async fetch() {
    const userStore = useUserStore.getState();
    const url = 'accounting/account/fetch';

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
