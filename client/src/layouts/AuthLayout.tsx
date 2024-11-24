import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Outlet, useNavigate } from 'react-router-dom';

function AuthLayout() {
  const auth = useAuth().auth;
  const navigate = useNavigate();

  useEffect(() => {
    if (auth) {
      navigate('/');
    }
  }, [auth, navigate]);

  return (
    <>
      <Outlet />;
      <Toaster />
    </>
  );
}

export default AuthLayout;
