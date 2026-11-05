import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { adminLogin } = useAdmin();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await adminLogin(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Maling admin credentials');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '60px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ color: '#FF6B95', fontSize: '2rem' }}>👑 Admin Panel</h1>
        <p style={{ color: '#AAA' }}>Mineme — Control Center</p>
      </div>

      <div className="card">
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Magpasok bilang Admin</h2>
        {error && <p style={{ color: '#EF4444', textAlign: 'center', marginBottom: '12px' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Admin Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Admin Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <button type="submit" className="btn-primary">Magpasok</button>
        </form>
      </div>
    </div>
  );
}
