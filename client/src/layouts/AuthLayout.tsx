import { useAuth } from '@/hooks/useAuth';
import { Toaster } from 'react-hot-toast';
import { Navigate, Outlet } from 'react-router-dom';

function AuthLayout() {
  const auth = useAuth().auth;

  if (auth) return <Navigate to="/" />;

  return (
    <>
      <Outlet />;
      <Toaster />
    </>
  );
}

export default AuthLayout;
