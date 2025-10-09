import { redirect } from 'react-router';
import { useUserStore } from '@/stores/user-store';

export async function authMiddleware() {
  const { data } = useUserStore.getState();

  //   Come Back To This Later
  if (!data?.accessToken || !data?.refreshToken) {
    throw redirect('/login');
  }

  return null;
}
