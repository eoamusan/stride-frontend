import axiosInstance from '@/lib/axios';
import { useUserStore } from '@/stores/user-store';

export default class AssetService {
  static async create({ data }) {
    const userStore = useUserStore.getState();
    const payload = { ...data, businessId: userStore.activeBusiness?._id };
    const response = await axiosInstance.post('asset', payload, {
      headers: {
        Authorization: `Bearer ${userStore.data?.accessToken}`,
      },
    });
    return response;
  }

  static async updatePurchaseInformation({ data, id }) {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.patch(`asset/purchase-details/${id}`, data, {
      headers: {
        Authorization: `Bearer ${userStore.data?.accessToken}`,
      },
    });
    return response;
  }

  static async updateLocation({ data, id }) {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.patch(`asset/location/${id}`, data, {
      headers: {
        Authorization: `Bearer ${userStore.data?.accessToken}`,
      },
    });
    return response;
  }

  static async updateStatusCondition({ data, id }) {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.patch(`asset/status/${id}`, data, {
      headers: {
        Authorization: `Bearer ${userStore.data?.accessToken}`,
      },
    });
    return response;
  }

  static async updateInsurance({ data, id }) {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.patch(`asset/insurance/${id}`, data, {
      headers: {
        Authorization: `Bearer ${userStore.data?.accessToken}`,
      },
    });
    return response;
  }

  static async updateAssetFile({ data, id }) {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.patch(`asset/asset-file/${id}`, data, {
      headers: {
        Authorization: `Bearer ${userStore.data?.accessToken}`,
      },
    });
    return response;
  }

  static async update({ data, id }) {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.patch(`asset/${id}`, data, {
      headers: {
        Authorization: `Bearer ${userStore.data?.accessToken}`,
      },
    });
    return response;
  }

  static async get({ id }) {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.get(`asset/${id}`, {
      headers: {
        Authorization: `Bearer ${userStore.data?.accessToken}`,
      },
    });
    return response;
  }

  static async fetch() {
    const userStore = useUserStore.getState();
    const url = 'asset/fetch';

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
    const url = 'asset/analytics';

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
    const response = await axiosInstance.delete(`asset/${id}`, {
      headers: {
        Authorization: `Bearer ${userStore.data?.accessToken}`,
      },
    });
    return response;
  }
}
