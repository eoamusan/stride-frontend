import axiosInstance from '@/lib/axios';

export default class OnboardingService {
  static async recordBusinessData(data) {
    try {
      const response = await axiosInstance.post('business', data);
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  }
}
