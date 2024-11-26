import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { lazy, Suspense, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Navigate, Outlet } from 'react-router-dom';

const Navbar = lazy(() => import('@/components/Navbar'));

function RootLayout() {
  const auth = useAuth().auth;
  const me = useAuth().me;
  const theme = useTheme().theme;

  useEffect(() => {
    me();
  }, [me]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  if (!auth) return <Navigate to="/auth/login" />;

  return (
    <>
      <Suspense>
        <Navbar />
      </Suspense>
      <Outlet />
      <Toaster />
    </>
  );
}

export default RootLayout;
