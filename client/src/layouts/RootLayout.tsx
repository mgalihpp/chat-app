import Navbar from '@/components/Navbar';
import { useAuth } from '@/hooks/useAuth';
import { Loader } from 'lucide-react';
import { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Outlet, useNavigate } from 'react-router-dom';

function RootLayout() {
  const auth = useAuth().auth;
  const me = useAuth().me;
  const isAuthenticating = useAuth().isAuthenticating;
  const onlineUsers = useAuth().onlineUsers;

  const navigate = useNavigate();

  // this came from the login/signup page for success message
  const message = window.localStorage.getItem('auth-message');

  console.log('Online users', onlineUsers);

  useEffect(() => {
    me();
  }, [me]);

  useEffect(() => {
    if (message) {
      toast.success(message);
      window.localStorage.removeItem('auth-message');
    }
  }, [message]);

  if (isAuthenticating) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  } else if (!auth) {
    navigate('/auth/login');
  }

  return (
    <div data-theme="dark">
      <Navbar />
      <Outlet />
      <Toaster />
    </div>
  );
}

export default RootLayout;
