import axiosInstance from '@/lib/axios';

export default class AuthService {
  static async register(data) {
    const response = await axiosInstance.post('auth/signup', data);
    return response;
  }

  static async login(data) {
    const response = await axiosInstance.post('auth/signin', data);
    return response;
  }

  static async google() {
    const response = await axiosInstance.get('auth/google');
    return response;
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

  static async forgotPassword(data) {
    const res = await axiosInstance.post('auth/forgot-password', data);
    return res;
  }

  static async verifyResetToken(data) {
    const res = await axiosInstance.post('auth/forgot-password/verify', data);
    return res;
  }

  static async resetPassword(data) {
    const res = await axiosInstance.post('auth/forgot-password/reset', data);
    return res;
  }
}
