import axiosInstance from '@/lib/axios';

export default class AuthService {
  static async register(data) {
    const response = await axiosInstance.post('auth/signup', data);
    return response;
  }

  static async login(data) {
    try {
      const response = await axiosInstance.post('auth/signin', data);
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  }

  static async google() {
    try {
      const response = await axiosInstance.get('auth/google');
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  }

  static async googleSuccess({ token }) {
    try {
      const response = await axiosInstance.post('auth/google/success', {
        token,
      });
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  }
}
