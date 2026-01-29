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

  static async fetch({
    subAccount,
    parentAccount,
    search,
    page,
    perPage,
    accountType,
  }) {
    const userStore = useUserStore.getState();
    const url = 'accounting/account/fetch';

    // Build params object with only defined values
    const params = {};
    if (subAccount !== undefined) params.subAccount = subAccount;
    if (parentAccount !== undefined) params.parentAccount = parentAccount;
    if (search !== undefined && search !== '') params.search = search;
    if (page !== undefined) params.page = page;
    if (perPage !== undefined) params.perPage = perPage;

    // Build body object with only defined values
    const body = {
      businessId: userStore.activeBusiness?._id,
    };
    if (accountType !== undefined) body.accountType = accountType;

    const response = await axiosInstance.post(url, body, {
      params,
      headers: {
        Authorization: `Bearer ${userStore.data?.accessToken}`,
      },
    });
    return response;
  }

  static async generatecode({ accountType }) {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.post(
      'accounting/account/generate/code',
      {
        businessId: userStore.activeBusiness?._id,
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

  static async fetchTransactions({
    businessId = false,
    accountingAccountId,
    type,
    startDate,
    endDate,
    trialBalance,
  }) {
    const userStore = useUserStore.getState();

    // Build params object with only defined values
    const params = {};
    if (startDate !== undefined) params.startDate = startDate;
    if (endDate !== undefined) params.endDate = endDate;

    const payload = {};
    if (accountingAccountId !== undefined)
      payload.accountingAccountId = accountingAccountId;
    if (type !== undefined) payload.type = type;
    if (businessId === true) payload.businessId = userStore.activeBusiness?._id;
    if (trialBalance !== undefined) payload.trialBalance = trialBalance;

    const response = await axiosInstance.post(
      'accounting/account/transaction',
      payload,
      {
        params,
        headers: {
          Authorization: `Bearer ${userStore.data?.accessToken}`,
        },
      }
    );
    return response;
  }

  static async fetchBudgetTransactions(data) {
    const userStore = useUserStore.getState();

    // Build params object with only defined values
    const { startDate, endDate } = data;
    const params = {};
    if (startDate !== undefined) params.startDate = startDate;
    if (endDate !== undefined) params.endDate = endDate;

    const payload = {};
    payload.businessId = userStore.activeBusiness?._id;
    payload.budget = true;

    const response = await axiosInstance.post(
      'accounting/account/transaction',
      payload,
      {
        params,
        headers: {
          Authorization: `Bearer ${userStore.data?.accessToken}`,
        },
      }
    );
    return response;
  }
}