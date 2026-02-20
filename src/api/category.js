import axiosInstance from '@/lib/axios';
import { useUserStore } from '@/stores/user-store';

export default class AssetCategoryService {
  static async create({ data }) {
    const userStore = useUserStore.getState();
    const payload = { ...data, businessId: userStore.activeBusiness?._id };
    const response = await axiosInstance.post('category', payload, {
      headers: {
        Authorization: `Bearer ${userStore.data?.accessToken}`,
      },
    });
    return response;
  }

  static async update({ data, id }) {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.patch(`category/${id}`, data, {
      headers: {
        Authorization: `Bearer ${userStore.data?.accessToken}`,
      },
    });
    return response;
  }

  static async get({ id }) {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.get(`category/${id}`, {
      headers: {
        Authorization: `Bearer ${userStore.data?.accessToken}`,
      },
    });
    return response;
  }

  static async fetch() {
    const userStore = useUserStore.getState();
    const url = 'category/fetch';

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
    const url = 'category/analytics';

    const body = { businessId: userStore.activeBusiness?._id };

    const response = await axiosInstance.post(url, body, {
      headers: {
        Authorization: `Bearer ${userStore.data?.accessToken}`,
      },
    });
    return response;
  }

  static async delete({ id }) {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.delete(`category/${id}`, {
      headers: {
        Authorization: `Bearer ${userStore.data?.accessToken}`,
      },
    });
    return response;
  }
}
