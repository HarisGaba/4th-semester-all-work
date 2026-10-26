import { useContext, useState } from 'react';
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import { clearAuth } from '@/api/api';
import { Layers3, LogOut, SunMoon, ArrowUpRight } from 'lucide-react';
import { ThemeContext } from '@/context/theme-context';
export default function DashboardLayout() {
  const user = useAuth();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const {
    toggleTheme
  } = useContext(ThemeContext);
  const sections = [['', 'Overview'], ['events', 'Expos'], ['sessions', 'Schedule & bookmarks'], ['floor-plan', 'Floor plan'], ['exhibitor-search', 'Discover exhibitors'], ['notifications', 'Notifications'], ['feedback', 'Feedback & support'], ...(['admin', 'organizer', 'exhibitor'].includes(user?.role) ? [['exhibitors', 'Exhibitors'], ['booths', 'Booths']] : []), ...(['admin', 'organizer', 'attendee'].includes(user?.role) ? [['attendees', 'Registrations']] : []), ...(['organizer', 'attendee', 'exhibitor'].includes(user?.role) ? [['messages', 'Messages']] : []), ...(['admin', 'organizer'].includes(user?.role) ? [['analytics', 'Analytics']] : []), ['contact', 'Contact']];
  async function signOut() {
    setBusy(true);
    try {
      clearAuth();
      navigate('/login');
    } catch {
      setError('Sign out failed. Please try again.');
    } finally {
      setBusy(false);
    }
  }
  return <div className="dashboard-shell">
      <header className="dashboard-header">
        <Link to="/" className="brand">
          <Layers3 />
          <span>EventSphere</span>
        </Link>
        <div className="dashboard-actions">
          <Link to="/">
            Explore <ArrowUpRight size={16} />
          </Link>
          <button onClick={toggleTheme} aria-label="Toggle color theme">
            <SunMoon size={20} />
          </button>
          <button onClick={signOut} disabled={busy}>
            <LogOut size={17} />
            {busy ? 'Signing out…' : 'Sign out'}
          </button>
        </div>
      </header>
      <div className="dashboard-body">
        <aside className="dashboard-sidebar">
          <div className="account-summary">
            <span className="account-avatar">{user?.name?.slice(0, 1).toUpperCase()}</span>
            <strong>{user?.name}</strong>
            <span className="status-pill">{user?.role}</span>
          </div>
          <nav aria-label="Dashboard">
            {sections.map(([section, label]) => <NavLink key={section} end={!section} to={section ? '/' + section : '/dashboard'}>
                {label}
              </NavLink>)}
          </nav>
        </aside>
        <main className="dashboard-main">
          {error && <p role="alert" className="form-error">
              {error}
            </p>}
          <Outlet />
        </main>
      </div>
    </div>;
}
