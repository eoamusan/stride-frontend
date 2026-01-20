import axiosInstance from '@/lib/axios';
import { useUserStore } from '@/stores/user-store';

export default class VendorService {
  static async create({ data }) {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.post('vendor', data, {
      headers: {
        Authorization: `Bearer ${userStore.data?.accessToken}`,
      },
    });
    return response;
  }

  static async addBusinessInfo({ data, id }) {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.patch(
      `vendor/${id}/business-information`,
      data,
      {
        headers: {
          Authorization: `Bearer ${userStore.data?.accessToken}`,
        },
      }
    );
    return response;
  }

  static async addContact({ data, id }) {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.patch(`vendor/${id}/contact`, data, {
      headers: {
        Authorization: `Bearer ${userStore.data?.accessToken}`,
      },
    });
    return response;
  }

  static async addBankDetails({ data, id }) {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.patch(
      `vendor/${id}/bank-details`,
      data,
      {
        headers: {
          Authorization: `Bearer ${userStore.data?.accessToken}`,
        },
      }
    );
    return response;
  }

  static async addAttachments({ data, id }) {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.patch(
      `vendor/${id}/attachment`,
      data,
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
    const response = await axiosInstance.get(`vendor/${id}`, {
      headers: {
        Authorization: `Bearer ${userStore.data?.accessToken}`,
      },
    });
    return response;
  }

  static async fetch({ page, perPage } = {}) {
    const userStore = useUserStore.getState();

    // Build query parameters
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (perPage) params.append('perPage', perPage);

    const queryString = params.toString();
    const url = queryString ? `vendor/fetch?${queryString}` : 'vendor/fetch';

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

  static async analytics() {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.post(
      'vendor/analytics',
      { businessId: userStore.activeBusiness?._id },
      {
        headers: {
          Authorization: `Bearer ${userStore.data?.accessToken}`,
        },
      }
    );
    return response;
  }

  static async update({ data, id }) {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.patch(`vendor/${id}`, data, {
      headers: {
        Authorization: `Bearer ${userStore.data?.accessToken}`,
      },
    });
    return response;
  }

  static async blacklist({ id }) {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.patch(
      `vendor/${id}`,
      {
        status: 'blacklisted',
      },
      {
        headers: {
          Authorization: `Bearer ${userStore.data?.accessToken}`,
        },
      }
    );
    return response;
  }
}
