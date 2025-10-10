import axiosInstance from '@/lib/axios';

export default class BusinessService {
  static async edit(data) {
    try {
      const response = await axiosInstance.patch('business', data);
      return response;
    } catch (err) {
      throw err;
    }
  }
}
