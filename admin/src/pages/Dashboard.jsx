import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAdmin } from '../context/AdminContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, pendingTransactions: 0 });
  const [loading, setLoading] = useState(true);
  const { adminLogout } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/api/admin/stats');
        setStats(res.data);
      } catch (err) {
        console.log('Error sa stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleLogout = () => {
    adminLogout();
    navigate('/login');
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>⌨️ Naglul…</div>;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1>👑 Dashboard</h1>
        <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#FF6B95', cursor: 'pointer' }}>
          Logout
        </button>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <p style={{ fontSize: '0.85rem', color: '#AAA' }}>Kabuuang Miyembro</p>
          <p className="stat-value">{stats.totalUsers}</p>
        </div>
        <div className="stat-card">
          <p style={{ fontSize: '0.85rem', color: '#AAA' }}>Naghihintay</p>
          <p className="stat-value" style={{ color: '#F59E0B' }}>{stats.pendingTransactions}</p>
        </div>
      </div>

      <div className="card">
        <h3>👋 Maligayang pagbabalik, Admin!</h3>
        <p style={{ color: '#AAA', fontSize: '0.9rem' }}>
          Gamitin ang ibabang nabigasyon para pamahalaan ang mga plano, code, miyembro, at kahilingan ng pag-withdraw o pagdeposito.
        </p>
      </div>
    </div>
  );
}
