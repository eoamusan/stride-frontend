import axiosInstance from '@/lib/axios';
import { useUserStore } from '@/stores/user-store';

export default class AccountService {
  static async create({ data }) {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.post('accounting/account', data, {
      headers: {
        Authorization: `Bearer ${userStore.data?.accessToken}`,
      },
    });
    return response;
  }

  static async get({ id }) {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.get(`accounting/account/${id}`, {
      headers: {
        Authorization: `Bearer ${userStore.data?.accessToken}`,
      },
    });
    return response;
  }

  static async update({ id, data }) {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.patch(
      `accounting/account/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${userStore.data?.accessToken}`,
        },
      }
    );
    return response;
  }

  static async fetch({ subAccount, parentAccount, search, page, perPage }) {
    const userStore = useUserStore.getState();
    const url = 'accounting/account/fetch';

    // Build params object with only defined values
    const params = {};
    if (subAccount !== undefined) params.subAccount = subAccount;
    if (parentAccount !== undefined) params.parentAccount = parentAccount;
    if (search !== undefined && search !== '') params.search = search;
    if (page !== undefined) params.page = page;
    if (perPage !== undefined) params.perPage = perPage;

    const response = await axiosInstance.post(
      url,
      {
        businessId: userStore.businessData?._id,
      },
      {
        params,
        headers: {
          Authorization: `Bearer ${userStore.data?.accessToken}`,
        },
      }
    );
    return response;
  }

  static async generatecode({ accountType }) {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.post(
      'accounting/account/generate/code',
      {
        businessId: userStore.businessData?._id,
        accountType: accountType,
      },
      {
        headers: {
          Authorization: `Bearer ${userStore.data?.accessToken}`,
        },
      }
    );
    return response;
  }
}
