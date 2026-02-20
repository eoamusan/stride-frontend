import axiosInstance from '@/lib/axios';
import { useUserStore } from '@/stores/user-store';

export default class JobPostService {
  static async create(payload) {
    const userStore = useUserStore.getState();
    // Handle both { data: ... } wrapper and direct payload
    let data = payload?.data || payload;

    if (data instanceof FormData) {
      if (userStore.data?.account?._id) {
        data.append('accountId', userStore.data.account._id);
      }
    } else {
      // Backend expects a single object, not an array
      data = {
        ...data,
        accountId: userStore.data?.account?._id,
        businessId: userStore.activeBusiness?._id,
      };
    }

    const response = await axiosInstance.post('job', data, {
      headers: {
        Authorization: `Bearer ${userStore.data?.accessToken}`,
      },
    });
    return response;
  }

  static async get({ id }) {
    const userStore = useUserStore.getState();
    console.log('JobPostService.get called with ID:', id);
    const url = `job/${id}`;
    console.log('Requesting URL:', url);

    // Attempting to add accountId just in case backend needs it for context, though usually GET params
    const response = await axiosInstance.get(url, {
      headers: {
        Authorization: `Bearer ${userStore.data?.accessToken}`,
      },
      params: {
        accountId: userStore.data?.account?._id,
        businessId: userStore.activeBusiness?._id,
      },
    });
    return response;
  }

  static async update({ id, data }) {
    const userStore = useUserStore.getState();
    const accountId = userStore.data?.account?._id;

    // Create a safe payload for update to avoid 'ClientSession' BSON errors
    // Also exclude 'status' as it might be restricted in general update
    const { status, ...rest } = data;
    const payload = {
      ...rest,
      accountId: userStore.data?.account?._id,
      businessId: userStore.activeBusiness?._id,
    };

    console.log('JobPostService.update called with ID:', id);
    console.log('Update Payload:', payload);

    const response = await axiosInstance.patch(`job/${id}`, payload, {
      headers: {
        Authorization: `Bearer ${userStore.data?.accessToken}`,
      },
    });
    return response;
  }

  static async updateStatus({ id, status }) {
    const userStore = useUserStore.getState();
    const payload = {
      status,
      accountId: userStore.data?.account?._id,
      // businessId: userStore.activeBusiness?._id,
    };

    console.log(
      'JobPostService.updateStatus called with ID:',
      id,
      'Status:',
      status
    );

    const response = await axiosInstance.patch(`job/${id}/status`, payload, {
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
    const url = queryString ? `job/fetch?${queryString}` : 'job/fetch';

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
    const response = await axiosInstance.delete(`job/${id}`, {
      headers: {
        Authorization: `Bearer ${userStore.data?.accessToken}`,
      },
    });
    return response;
  }
}
