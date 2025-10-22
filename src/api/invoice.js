import axiosInstance from '@/lib/axios';
import { useUserStore } from '@/stores/user-store';

export default class InvoiceService {
  static async create({ data }) {
    try {
      const userStore = useUserStore.getState();
      const response = await axiosInstance.post('invoice', data, {
        headers: {
          Authorization: `Bearer ${userStore.data?.accessToken}`,
        },
      });
      return response;
    } catch (err) {
      throw err;
    }
  }

  static async get({ id }) {
    try {
      const userStore = useUserStore.getState();
      const response = await axiosInstance.get(`invoice/${id}`, {
        headers: {
          Authorization: `Bearer ${userStore.data?.accessToken}`,
        },
      });
      return response;
    } catch (err) {
      throw err;
    }
  }

  static async fetch({ businessId }) {
    try {
      const userStore = useUserStore.getState();
      const response = await axiosInstance.post(
        `invoice/fetch`,
        { businessId },
        {
          headers: {
            Authorization: `Bearer ${userStore.data?.accessToken}`,
          },
        }
      );
      return response;
    } catch (err) {
      throw err;
    }
  }

  static async createPayment({ data }) {
    try {
      const userStore = useUserStore.getState();
      const response = await axiosInstance.post(`invoice/payment`, data, {
        headers: {
          Authorization: `Bearer ${userStore.data?.accessToken}`,
        },
      });
      return response;
    } catch (err) {
      throw err;
    }
  }

  static async getPayment({ id }) {
    try {
      const userStore = useUserStore.getState();
      const response = await axiosInstance.get(`invoice/payment/${id}`, {
        headers: {
          Authorization: `Bearer ${userStore.data?.accessToken}`,
        },
      });
      return response;
    } catch (err) {
      throw err;
    }
  }

  static async fetchPayments({ customerId }) {
    try {
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
    } catch (err) {
      throw err;
    }
  }

  static async createSettings({ data }) {
    try {
      const userStore = useUserStore.getState();
      const response = await axiosInstance.post(`invoice/settings`, data, {
        headers: {
          Authorization: `Bearer ${userStore.data?.accessToken}`,
        },
      });
      return response;
    } catch (err) {
      throw err;
    }
  }

  static async getSettings({ id }) {
    try {
      const userStore = useUserStore.getState();
      const response = await axiosInstance.get(`invoice/settings/${id}`, {
        headers: {
          Authorization: `Bearer ${userStore.data?.accessToken}`,
        },
      });
      return response;
    } catch (err) {
      throw err;
    }
  }

  static async fetchSettings({ customerId }) {
    try {
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
    } catch (err) {
      throw err;
    }
  }
}
