import axiosInstance from '@/lib/axios';
import { useUserStore } from '@/stores/user-store';

export default class CategoryService {
  static async create({ name }) {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.post(
      'service',
      {
        businessId: userStore.activeBusiness?._id,
        name,
      },
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
    const response = await axiosInstance.get(`service/${id}`, {
      headers: {
        Authorization: `Bearer ${userStore.data?.accessToken}`,
      },
    });
    return response;
  }

  static async update({ id, name }) {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.patch(
      `service/${id}`,
      {
        businessId: userStore.activeBusiness?._id,
        name,
      },
      {
        headers: {
          Authorization: `Bearer ${userStore.data?.accessToken}`,
        },
      }
    );
    return response;
  }

  static async fetch({ search, page, perPage }) {
    const userStore = useUserStore.getState({ search, page, perPage });

    // Build query parameters
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (page) params.append('page', page);
    if (perPage) params.append('perPage', perPage);

    const queryString = params.toString();
    const url = queryString ? `service/fetch?${queryString}` : 'service/fetch';

    const response = await axiosInstance.post(
      url,
      { businessId: userStore.activeBusiness?._id },
      {
        headers: {
          Authorization: `Bearer ${userStore.data?.accessToken}`,
        },
      }
    );
    return response;
  }

  static async delete({ id }) {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.delete(`service/${id}`, {
      headers: {
        Authorization: `Bearer ${userStore.data?.accessToken}`,
      },
    });
    return response;
  }
}
