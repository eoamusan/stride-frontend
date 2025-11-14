import axiosInstance from '@/lib/axios';
import { useUserStore } from '@/stores/user-store';

export default class PaymentService {
  static async create({ data }) {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.post('payment', data, {
      headers: {
        Authorization: `Bearer ${userStore.data?.accessToken}`,
      },
    });
    return response;
  }

  static async get({ id }) {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.get(`payment/${id}`, {
      headers: {
        Authorization: `Bearer ${userStore.data?.accessToken}`,
      },
    });
    return response;
  }

  static async fetchInvoiceDetails({ invoiceId }) {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.post(
      `payment/fetch`,
      { invoiceId },
      {
        headers: {
          Authorization: `Bearer ${userStore.data?.accessToken}`,
        },
      }
    );
    return response;
  }

  static async fetch({ page, perPage } = {}) {
    const userStore = useUserStore.getState();

    // Build query parameters
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (perPage) params.append('perPage', perPage);

    const queryString = params.toString();
    const url = queryString ? `payment/fetch?${queryString}` : 'payment/fetch';

    const response = await axiosInstance.post(
      url,
      { businessId: userStore.businessData?._id },
      {
        headers: {
          Authorization: `Bearer ${userStore.data?.accessToken}`,
        },
      }
    );
    return response;
  }
}
