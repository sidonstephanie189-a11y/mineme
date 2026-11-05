import { useLocation, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/plans', label: 'Plans', icon: '📊' },
    { path: '/wallet', label: 'Wallet', icon: '💰' },
    { path: '/profile', label: 'Profile', icon: '👤' }
  ];

  return (
    <nav className="bottom-nav">
      {links.map(link => (
        <button
          key={link.path}
          onClick={() => navigate(link.path)}
          className={location.pathname === link.path ? 'active' : ''}
        >
          <span style={{ fontSize: '1.2rem' }}>{link.icon}</span>
          <span>{link.label}</span>
        </button>
      ))}
    </nav>
  );
}
