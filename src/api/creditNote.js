import axiosInstance from '@/lib/axios';
import { useUserStore } from '@/stores/user-store';

export default class CreditNoteService {
  static async create({ data }) {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.post('credit-note', data, {
      headers: {
        Authorization: `Bearer ${userStore.data?.accessToken}`,
      },
    });
    return response;
  }

  static async get({ id }) {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.get(`credit-note/${id}`, {
      headers: {
        Authorization: `Bearer ${userStore.data?.accessToken}`,
      },
    });
    return response;
  }

  static async update({ id, data }) {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.patch(`credit-note/${id}`, data, {
      headers: {
        Authorization: `Bearer ${userStore.data?.accessToken}`,
      },
    });
    return response;
  }

  static async fetch({ search, page, perPage, customerId }) {
    const userStore = useUserStore.getState({ search, page, perPage });

    // Build query parameters
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (page) params.append('page', page);
    if (perPage) params.append('perPage', perPage);

    const queryString = params.toString();
    const url = queryString
      ? `credit-note/fetch?${queryString}`
      : 'credit-note/fetch';

    const body = {};
    body.businessId = userStore.businessData?._id;
    if (customerId) body.customerId = customerId;

    const response = await axiosInstance.post(
      url,
      body,
      {
        headers: {
          Authorization: `Bearer ${userStore.data?.accessToken}`,
        },
      }
    );
    return response;
  }

  static async generateMemoId() {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.post(
      'credit-note/generate/memo',
      {
        businessId: userStore.businessData?._id,
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
