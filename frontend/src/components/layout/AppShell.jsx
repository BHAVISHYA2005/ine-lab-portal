import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function AppShell() {
  const { user, logout } = useAuth();
  return <div className="app-shell">
    <header className="topbar">
      <NavLink className="brand" to="/dashboard"><span className="brand-mark">/</span> INE Labs</NavLink>
      <nav className="nav-links" aria-label="Primary navigation">
        <NavLink to="/dashboard">Overview</NavLink>
        <NavLink to="/labs">Labs</NavLink>
        <NavLink to="/submissions">Submissions</NavLink>
      </nav>
      <div className="account-area"><span className="account-email">{user?.email}</span><button className="text-button" onClick={logout}>Sign out</button></div>
    </header>
    <Outlet />
  </div>;
}
