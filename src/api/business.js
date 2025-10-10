import axiosInstance from '@/lib/axios';

export default class BusinessService {
  static async create(data) {
    try {
      const response = await axiosInstance.post('business', data);
      return response;
    } catch (err) {
      throw err;
    }
  }
}
