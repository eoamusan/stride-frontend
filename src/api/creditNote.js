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

  static async fetch() {
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
  }
}
