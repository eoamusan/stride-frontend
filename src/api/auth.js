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
    try {
      const response = await axiosInstance.get('auth/google');
      return response;
    } catch (err) {
      throw err;
    }
  }

  static async forgotPassword(data) {
    try {
      const res = await axiosInstance.post('auth/forgot-password', data);
      return res;
    } catch (err) {
      throw err;
    }
  }

  static async verifyResetToken(data) {
    try {
      const res = await axiosInstance.post('auth/forgot-password/verify', data);
      return res;
    } catch (err) {
      throw err;
    }
  }

  static async resetPassword(data) {
    try {
      const res = await axiosInstance.post('auth/forgot-password/reset', data);
      return res;
    } catch (err) {
      throw err;
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
