import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Header: React.FC = () => {
  const { logout } = useAuth();
  return (
    <header>
      <div className="header-left">
        <Link to="/">
          <img src="/logo.png" alt="Finnplay Logo" className="logo" />
        </Link>
      </div>
      <div className="header-right">
        <img src="/profile.png" alt="Profile" className="profile-icon" />
        <button onClick={logout}>Logout</button>
      </div>
    </header>
  );
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="app">
      {!isLoginPage && <Header />}
      <main>{children}</main>
    </div>
  );
};

export default Layout;
