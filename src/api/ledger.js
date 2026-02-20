import axiosInstance from '@/lib/axios';
import { useUserStore } from '@/stores/user-store';

export default class LedgerService {
  static async get({ id }) {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.get(`ledger/${id}`, {
      headers: {
        Authorization: `Bearer ${userStore.data?.accessToken}`,
      },
    });
    return response;
  }

  static async fetch({ search, page, perPage } = {}) {
    const userStore = useUserStore.getState();

    // Build query parameters
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (page) params.append('page', page);
    if (perPage) params.append('perPage', perPage);

    const queryString = params.toString();
    const url = queryString ? `ledger/fetch?${queryString}` : 'ledger/fetch';

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
}
