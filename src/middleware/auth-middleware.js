import { redirect } from 'react-router';
import { useUserStore } from '@/stores/user-store';

export async function authMiddleware() {
  const userStore = useUserStore.getState();
  const { data } = userStore;

  // Check if tokens exist
  if (!data?.accessToken || !data?.refreshToken) {
    // Clear storage and redirect to login
    localStorage.removeItem('user-storage');
    throw redirect('/login');
  }

  try {
    // Try to fetch business data with existing token
    await userStore.getBusinessData();
    return null;
  } catch (error) {
    // Check if error is 401 unauthorized
    if (
      error.response?.data?.statusCode === 401 ||
      error.response?.status === 401
    ) {
      try {
        // Try to refresh the token
        await userStore.refresh();
        return null;
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);

        // Clear storage and redirect to login
        localStorage.removeItem('user-storage');
        useUserStore.setState({ data: null, activeBusiness: null });

        throw redirect('/login');
      }
    }

    // For other errors, clear and redirect
    console.error('Authentication failed:', error);
    localStorage.removeItem('user-storage');
    useUserStore.setState({ data: null, activeBusiness: null });

    throw redirect('/login');
  }
}
