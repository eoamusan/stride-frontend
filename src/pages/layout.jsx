import { createBrowserRouter } from 'react-router';
import Landing from './landing/page';
import Login from './auth/login/page';
import Register from './auth/register/page';
import Onboarding from './dashboard/onboarding/page';

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
        children: [
          { path: 'onboarding', Component: Onboarding },
          {
            Component: <>DashboardLayout</>,
            children: [
              {
                index: true,
                Component: <>DashboardOverview</>,
              },
              { path: 'settings', Component: <>Settings</> },
              { path: 'profile', Component: <>Profile</> },
            ],
          },
        ],
      },
    ],
  },
]);

export { router };
