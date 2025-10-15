import axiosInstance from '@/lib/axios';
import { useUserStore } from '@/stores/user-store';

export default class BusinessService {
  static async create(data) {
    try {
      const userStore = useUserStore.getState();
      const response = await axiosInstance.post('business', data, {
        headers: {
          Authorization: `Bearer ${userStore.data?.accessToken}`,
        },
      });
      return response;
    } catch (err) {
      throw err;
    }
  }
}
