import { MessageSquare, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <header className="border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              Chat App
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/settings" className="btn btn-sm gap-2 transition-colors">
              <Settings />
              <span className="hidden sm:inline-flex">Settings</span>
            </Link>

            {/* TODO: MAKE LOGOUT BUTTON */}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
