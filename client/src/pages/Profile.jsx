import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '32px' }}>
        <div style={{
          width: '90px',
          height: '90px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #FF97B7, #FF6B95)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2.5rem',
          color: 'white',
          margin: '0 auto 12px'
        }}>
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <h2>{user?.name}</h2>
        <p style={{ color: '#888' }}>{user?.email}</p>
        <span className="badge-yellow">
          {user?.role === 'admin' ? '👑 Admin' : '💖 Member'}
        </span>
      </div>

      <div className="card">
        <p><strong>Kabuuang Balanse:</strong></p>
        <p className="balance-text">₱{user?.balance?.toFixed(2) || '0.00'}</p>
      </div>

      {user?.role === 'admin' && (
        <div className="card" style={{ background: '#FFFBEB', border: '1px solid #FFD700' }}>
          <h3>👑 Admin Panel</h3>
          <p style={{ fontSize: '0.9rem' }}>Buksan ang admin website para pamahalaan ang lahat.</p>
          <button
            className="btn-cream"
            style={{ width: '100%', marginTop: '8px' }}
            onClick={() => window.open('http://localhost:5174', '_blank')}
          >
            Pumunta sa Admin
          </button>
        </div>
      )}

      <button
        onClick={handleLogout}
        style={{
          width: '100%',
          padding: '16px',
          marginTop: '24px',
          background: 'rgba(230, 57, 70, 0.1)',
          color: '#E63946',
          border: 'none',
          borderRadius: '20px',
          fontSize: '1rem',
          fontWeight: '600',
          cursor: 'pointer'
        }}
      >
        Mag-log out
      </button>
    </div>
  );
}
