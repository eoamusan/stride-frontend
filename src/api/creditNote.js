import axiosInstance from '@/lib/axios';
import { useUserStore } from '@/stores/user-store';

export default class CreditNoteService {
  static async create({ data }) {
    try {
      const userStore = useUserStore.getState();
      const response = await axiosInstance.post('credit-note', data, {
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
      const response = await axiosInstance.get(`credit-note/${id}`, {
        headers: {
          Authorization: `Bearer ${userStore.data?.accessToken}`,
        },
      });
      return response;
    } catch (err) {
      throw err;
    }
  }

  static async fetch() {
    try {
      const userStore = useUserStore.getState();
      const response = await axiosInstance.post(
        'credit-note/fetch',
        { accountId: userStore.data?.account?._id },
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
