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
    const response = await axiosInstance.put(`invoice/${id}`, data, {
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

  static async fetch({
    businessId,
    customerId,
    status,
    page,
    perPage,
    search,
    type,
    graph,
    startDate,
    endDate,
  }) {
    const userStore = useUserStore.getState();
    const body = {};
    
    if (businessId) {
      body.businessId = businessId;
    }
    if (type) {
      body.type = type;
    }
    if (graph) {
      body.graph = graph;
    }
    if (customerId) {
      body.customerId = customerId;
    }
    if (status) {
      body.status = status;
    }

    // Build query params only if provided
    const queryParams = new URLSearchParams();
    if (page !== undefined) queryParams.append('page', page);
    if (perPage !== undefined) queryParams.append('perPage', perPage);
    if (search !== undefined) queryParams.append('search', search);
    if( startDate !== undefined ) queryParams.append('startDate', startDate);
    if( endDate !== undefined ) queryParams.append('endDate', endDate);

    const queryString = queryParams.toString();
    const url = queryString ? `invoice/fetch?${queryString}` : 'invoice/fetch';

    const response = await axiosInstance.post(url, body, {
      headers: {
        Authorization: `Bearer ${userStore.data?.accessToken}`,
      },
    });
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

  static async getInvoiceNumber() {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.post(
      `invoice/generate/number`,
      { businessId: userStore.businessData?._id },
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

  static async generatePdf({ id }) {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.get(`invoice/${id}/pdf`, {
      headers: {
        Authorization: `Bearer ${userStore.data?.accessToken}`,
      },
      responseType: 'blob', // Important for PDF files
    });
    return response;
  }
}
