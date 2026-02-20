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

  static async fetch({ search, page, perPage }) {
    const userStore = useUserStore.getState();

    // Build query parameters
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (page) params.append('page', page);
    if (perPage) params.append('perPage', perPage);

    const queryString = params.toString();
    const url = queryString
      ? `customer/fetch?${queryString}`
      : 'customer/fetch';

    const response = await axiosInstance.post(
      url,
      { businessId: userStore?.activeBusiness?._id },
      {
        headers: {
          Authorization: `Bearer ${userStore.data?.accessToken}`,
        },
      }
    );
    return response;
  }

  static async update({ id, data }) {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.patch(`customer/${id}`, data, {
      headers: {
        Authorization: `Bearer ${userStore.data?.accessToken}`,
      },
    });
    return response;
  }

  static async analytics() {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.post(
      'customer/analytics',
      { businessId: userStore?.activeBusiness?._id },
      {
        headers: {
          Authorization: `Bearer ${userStore.data?.accessToken}`,
        },
      }
    );
    return response;
  }
}
