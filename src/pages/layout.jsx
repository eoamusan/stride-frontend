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
      { path: 'login', Component: Login },
      { path: 'register', Component: Register },
      {
        path: 'dashboard',
        Component: () => <div>Dashboard</div>,
        children: [
          { path: 'settings', Component: () => <div>Settings</div> },
          { path: 'profile', Component: () => <div>Profile</div> },
        ],
      },
    ],
  },
]);

export { router };
