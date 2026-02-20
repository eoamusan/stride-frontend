import axiosInstance from '@/lib/axios';
import { useUserStore } from '@/stores/user-store';

export default class FinancialReportService {
  static async fetch({ startDate, endDate } = {}) {
    const userStore = useUserStore.getState();

    // Build query parameters
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const queryString = params.toString();
    const url = queryString
      ? `financial-report/analytics?${queryString}`
      : 'financial-report/analytics';

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

  static async fetchCustomerReport({ startDate, endDate } = {}) {
    const userStore = useUserStore.getState();

    // Build query parameters
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const queryString = params.toString();
    const url = queryString
      ? `financial-report/analytics/customer?${queryString}`
      : 'financial-report/analytics/customer';

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

  static async fetchVendorReport({ startDate, endDate } = {}) {
    const userStore = useUserStore.getState();

    // Build query parameters
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const queryString = params.toString();
    const url = queryString
      ? `financial-report/analytics/vendor?${queryString}`
      : 'financial-report/analytics/vendor';

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

  static async fetchArReport({ startDate, endDate } = {}) {
    const userStore = useUserStore.getState();

    // Build query parameters
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const queryString = params.toString();
    const url = queryString
      ? `financial-report/analytics/ar-ap?${queryString}`
      : 'financial-report/analytics/ar-ap';

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
