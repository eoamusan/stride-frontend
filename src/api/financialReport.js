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
