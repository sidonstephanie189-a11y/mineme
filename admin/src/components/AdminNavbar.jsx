import { useLocation, useNavigate } from 'react-router-dom';

export default function AdminNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/plans', label: 'Plans', icon: '📈' },
    { path: '/codes', label: 'Codes', icon: '🎟️' },
    { path: '/users', label: 'Users', icon: '👥' },
    { path: '/requests', label: 'Requests', icon: '📋' }
  ];

  return (
    <nav className="bottom-nav">
      {links.map(link => (
        <button
          key={link.path}
          onClick={() => navigate(link.path)}
          className={location.pathname === link.path ? 'active' : ''}
        >
          <span style={{ fontSize: '1.1rem' }}>{link.icon}</span>
          <span style={{ fontSize: '0.7rem' }}>{link.label}</span>
        </button>
      ))}
    </nav>
  );
}
