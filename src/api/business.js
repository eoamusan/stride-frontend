import axiosInstance from '@/lib/axios';
import { useUserStore } from '@/stores/user-store';

export default class BusinessService {
  static async create(data) {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.post('business', data, {
      headers: {
        Authorization: `Bearer ${userStore.data?.accessToken}`,
      },
    });
    return response;
  }

  static async get({ id }) {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.get(`business/${id}`, {
      headers: {
        Authorization: `Bearer ${userStore.data?.accessToken}`,
      },
    });
    return response;
  }

  static async fetch() {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.post(
      `business/fetch`,
      { accountId: userStore.data?.account?._id },
      {
        headers: {
          Authorization: `Bearer ${userStore.data?.accessToken}`,
        },
      }
    );
    return response;
  }

  static async patchSettings({ id, data }) {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.patch(
      `business/${id}/invoice/settings`,
      data,
      {
        headers: {
          Authorization: `Bearer ${userStore.data?.accessToken}`,
        },
      }
    );
    return response;
  }
}
