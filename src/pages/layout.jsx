import { createBrowserRouter } from 'react-router';
import Landing from './landing/page';
import Login from './auth/login/page';
import Register from './auth/register/page';

const router = createBrowserRouter([
  {
    path: '/',
    children: [
      {
        index: true,
        Component: Landing,
      },
      {
        path: 'auth',
        children: [
          { path: 'login', Component: Login },
          { path: 'register', Component: Register },
        ],
      },
    ],
  },
]);

export { router };
