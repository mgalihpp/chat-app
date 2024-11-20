import Navbar from '@/components/Navbar';
import { Toaster } from 'react-hot-toast';
import { Outlet } from 'react-router-dom';

function RootLayout() {
  return (
    <div data-theme="dark">
      <Navbar />
      <Outlet />
      <Toaster />
    </div>
  );
}

export default RootLayout;
