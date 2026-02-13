import axiosInstance from '@/lib/axios';
import { useUserStore } from '@/stores/user-store';

export default class OptionService {
  static async create({ data }) {
    const userStore = useUserStore.getState();
    const payload = { ...data, businessId: userStore.activeBusiness?._id };
    const response = await axiosInstance.post('option', payload, {
      headers: {
        Authorization: `Bearer ${userStore.data?.accessToken}`,
      },
    });
    return response;
  }

  static async get({ id }) {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.get(`option/${id}`, {
      headers: {
        Authorization: `Bearer ${userStore.data?.accessToken}`,
      },
    });
    return response;
  }

  static async fetch({
    section,
  }) {
    const userStore = useUserStore.getState();
    const url = 'option/fetch';

    // Build body object with only defined values
    const body = {
      businessId: userStore.activeBusiness?._id,
      section
    };
    const response = await axiosInstance.post(url, body, {
      headers: {
        Authorization: `Bearer ${userStore.data?.accessToken}`,
      },
    });
    return response;
  }
}