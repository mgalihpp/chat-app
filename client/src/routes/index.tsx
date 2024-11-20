import RootLayout from '@/layouts/RootLayout';
import { RouteObject } from 'react-router-dom';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: '',
        element: <></>,
      },
    ],
  },
];

export default routes;
