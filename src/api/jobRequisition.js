import axiosInstance from '@/lib/axios';
import { useUserStore } from '@/stores/user-store';

export default class JobRequisitionService {
  static async create(payload) {
    const userStore = useUserStore.getState();
    // Handle both { data: ... } wrapper and direct payload
    let data = payload?.data || payload;

    if (data instanceof FormData) {
      if (userStore.data?.account?._id) {
        data.append('accountId', userStore.data.account._id);
      }
    } else {
      data = {
        ...data,
        accountId: userStore.data?.account?._id,
      };
    }

    const response = await axiosInstance.post('job-requisition', data, {
      headers: {
        Authorization: `Bearer ${userStore.data?.accessToken}`,
      },
    });
    return response;
  }

  static async get({ id }) {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.get(`job-requisition/${id}`, {
      headers: {
        Authorization: `Bearer ${userStore.data?.accessToken}`,
      },
    });
    return response;
  }

  static async update({ id, data }) {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.patch(`job-requisition/${id}`, data, {
      headers: {
        Authorization: `Bearer ${userStore.data?.accessToken}`,
      },
    });
    return response;
  }

  static async fetch({ search, page, perPage } = {}) {
    const userStore = useUserStore.getState();
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (page) params.append('page', page);
    if (perPage) params.append('perPage', perPage);

    const queryString = params.toString();
    const url = queryString
      ? `job-requisition/fetch?${queryString}`
      : 'job-requisition/fetch';

    const response = await axiosInstance.post(
      url,
      {
        businessId: userStore.activeBusiness?._id,
        accountId: userStore.data?.account?._id,
      },
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
    const response = await axiosInstance.delete(`job-requisition/${id}`, {
      headers: {
        Authorization: `Bearer ${userStore.data?.accessToken}`,
      },
    });
    return response;
  }
}
