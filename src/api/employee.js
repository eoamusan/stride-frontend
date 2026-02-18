import axiosInstance from '@/lib/axios';
import { useUserStore } from '@/stores/user-store';

export default class EmployeeService {
  static async create({ data }) {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.post('hr/employee', data, {
      headers: {
        Authorization: `Bearer ${userStore.data?.accessToken}`,
      },
    });
    return response;
  }

  static async get({ id }) {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.get(`hr/employee/${id}`, {
      headers: {
        Authorization: `Bearer ${userStore.data?.accessToken}`,
      },
    });
    return response;
  }

  static async fetch({ search, page, perPage, status, department }) {
    const userStore = useUserStore.getState();

    // Build query parameters
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (page) params.append('page', page);
    if (perPage) params.append('perPage', perPage);
    if (status) params.append('status', status);
    if (department) params.append('department', department);

    const queryString = params.toString();
    const url = queryString
      ? `hr/employee/fetch?${queryString}`
      : 'hr/employee/fetch';

    const response = await axiosInstance.post(
      url,
      { businessId: userStore?.activeBusiness?._id },
      {
        headers: {
          Authorization: `Bearer ${userStore.data?.accessToken}`,
        },
      }
    );
    return response;
  }

  static async update({ id, data }) {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.patch(`hr/employee/${id}`, data, {
      headers: {
        Authorization: `Bearer ${userStore.data?.accessToken}`,
      },
    });
    return response;
  }

  static async delete({ id }) {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.delete(`hr/employee/${id}`, {
      headers: {
        Authorization: `Bearer ${userStore.data?.accessToken}`,
      },
    });
    return response;
  }

  static async analytics() {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.post(
      'hr/employee/analytics',
      { businessId: userStore?.activeBusiness?._id },
      {
        headers: {
          Authorization: `Bearer ${userStore.data?.accessToken}`,
        },
      }
    );
    return response;
  }

  static async getDepartments() {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.get('hr/department/fetch', {
      headers: {
        Authorization: `Bearer ${userStore.data?.accessToken}`,
      },
    });
    return response;
  }

  static async getPositions() {
    const userStore = useUserStore.getState();
    const response = await axiosInstance.get('hr/position/fetch', {
      headers: {
        Authorization: `Bearer ${userStore.data?.accessToken}`,
      },
    });
    return response;
  }
}
