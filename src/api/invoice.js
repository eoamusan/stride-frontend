import axiosInstance from '@/lib/axios';
import { useUserStore } from '@/stores/user-store';

export default class InvoiceService {
  static async create({ data }) {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.post('invoice', data, {
      headers: {
        Authorization: `Bearer ${userStore.data?.accessToken}`,
      },
    });
    return response;
  }

  static async update({ id, data }) {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.patch(`invoice/${id}`, data, {
      headers: {
        Authorization: `Bearer ${userStore.data?.accessToken}`,
      },
    });
    return response;
  }

  static async get({ id }) {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.get(`invoice/${id}`, {
      headers: {
        Authorization: `Bearer ${userStore.data?.accessToken}`,
      },
    });
    return response;
  }

  static async fetch({ businessId, page, perPage, search }) {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.post(
      `invoice/fetch?page=${page ?? 1}&perPage=${perPage ?? 10}&search=${search ?? ''}`,
      { businessId },
      {
        headers: {
          Authorization: `Bearer ${userStore.data?.accessToken}`,
        },
      }
    );
    return response;
  }

  static async getPayment({ id }) {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.get(`invoice/payment/${id}`, {
      headers: {
        Authorization: `Bearer ${userStore.data?.accessToken}`,
      },
    });
    return response;
  }

  static async getAnalytics({ businessId }) {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.post(
      `invoice/analytics`,
      { businessId },
      {
        headers: {
          Authorization: `Bearer ${userStore.data?.accessToken}`,
        },
      }
    );
    return response;
  }

  static async fetchPayments({ customerId }) {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.post(
      `invoice/payment/fetch`,
      { customerId },
      {
        headers: {
          Authorization: `Bearer ${userStore.data?.accessToken}`,
        },
      }
    );
    return response;
  }

  static async sendEmail({ data }) {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.post(
      `invoice/send/email`,
      { data },
      {
        headers: {
          Authorization: `Bearer ${userStore.data?.accessToken}`,
        },
      }
    );
    return response;
  }

  static async createSettings({ data }) {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.post(`invoice/settings`, data, {
      headers: {
        Authorization: `Bearer ${userStore.data?.accessToken}`,
      },
    });
    return response;
  }

  static async getSettings({ id }) {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.get(`invoice/settings/${id}`, {
      headers: {
        Authorization: `Bearer ${userStore.data?.accessToken}`,
      },
    });
    return response;
  }

  static async fetchSettings({ customerId }) {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.post(
      `invoice/settings`,
      { customerId },
      {
        headers: {
          Authorization: `Bearer ${userStore.data?.accessToken}`,
        },
      }
    );
    return response;
  }
}
