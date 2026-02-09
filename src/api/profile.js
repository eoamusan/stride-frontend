import axiosInstance from '@/lib/axios';
import { useUserStore } from '@/stores/user-store';

export default class ProfileService {
  static async fetch() {
    const userStore = useUserStore.getState();

    const response = await axiosInstance.post(
      'profile/fetch',
      { accountId: userStore.data?.account?._id },
      {
        headers: {
          Authorization: `Bearer ${userStore.data?.accessToken}`,
        },
      }
    );
    return response;
  }

  static async get({ id }) {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.get(`profile/${id}`, {
      headers: {
        Authorization: `Bearer ${userStore.data?.accessToken}`,
      },
    });
    return response;
  }

  static async update({ id, data }) {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.patch(`profile/${id}`, data, {
      headers: {
        Authorization: `Bearer ${userStore.data?.accessToken}`,
      },
    });
    return response;
  }
}
