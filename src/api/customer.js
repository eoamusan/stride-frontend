import axiosInstance from '@/lib/axios';
import { useUserStore } from '@/stores/user-store';

export default class CustomerService {
  static async create({ data }) {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.post('customer', data, {
      headers: {
        Authorization: `Bearer ${userStore.data?.accessToken}`,
      },
    });
    return response;
  }

  static async get({ id }) {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.get(`customer/${id}`, {
      headers: {
        Authorization: `Bearer ${userStore.data?.accessToken}`,
      },
    });
    return response;
  }

  static async fetch() {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.post(
      'customer/fetch',
      { businessId: userStore?.businessData?._id  },
      {
        headers: {
          Authorization: `Bearer ${userStore.data?.accessToken}`,
        },
      }
    );
    return response;
  }
}
