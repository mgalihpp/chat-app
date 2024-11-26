import AuthLayout from '@/layouts/AuthLayout';
import RootLayout from '@/layouts/RootLayout';
import { RouteObject } from 'react-router-dom';
import LoginPage from '@/routes/Auth/Login/LoginPage';
import { loginAction } from '@/routes/Auth/Login/actions/loginAction';
import SignUpPage from '@/routes/Auth/Signup/SingUpPage';
import { signUpAction } from '@/routes/Auth/Signup/actions/signUpAction';
import { logoutAction } from '@/routes/Auth/Logout/actions/logoutAction';
import { homeLoader } from '@/routes/Home/homeLoader';
import HomePage from '@/routes/Home/HomePage';
import { chatLoader } from '@/routes/Home/loaders/chatLoader';
import ProfilePage from '@/routes/Auth/Profile/ProfilePage';
import SettingsPage from './Settings/SettingsPage';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: '',
        lazy: async () => {
          return {
            element: <HomePage />,
            loader: homeLoader,
          };
        },
      },
      {
        path: '/profile',
        element: <ProfilePage />,
      },
      {
        path: '/settings',
        element: <SettingsPage />,
      },
      {
        path: 'chat/:id',
        loader: chatLoader,
      },
    ],
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <LoginPage />,
        action: loginAction,
      },
      {
        path: 'signup',
        element: <SignUpPage />,
        action: signUpAction,
      },
      {
        path: 'logout',
        action: logoutAction,
      },
    ],
  },
];

export default routes;
