import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.msg || 'Hindi makagawa ng account');
    }
  };

  return (
    <div style={{ maxWidth: '420px', margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ color: '#FF6B95', fontSize: '2rem' }}>💖 Mineme</h1>
        <p>Simulan ang iyong paglalakbay!</p>
      </div>

      <div className="card">
        <div style={{
          background: 'linear-gradient(135deg, #FFD700, #FFC107)',
          borderRadius: '14px',
          padding: '12px',
          marginBottom: '20px',
          textAlign: 'center',
          fontWeight: '600',
          color: '#5D4000'
        }}>
          🎁 Magrehistro ngayon → +₱50 Bonus!
        </div>

        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Gumawa ng Account</h2>
        {error && <p style={{ color: '#E63946', textAlign: 'center' }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Pangalan"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <button type="submit" className="btn-red">Magrehistro</button>
        </form>
      </div>

      <p style={{ textAlign: 'center', marginTop: '20px' }}>
        May account na?{' '}
        <Link to="/login" style={{ color: '#FF6B95', fontWeight: '600' }}>
          Magpasok
        </Link>
      </p>
    </div>
  );
}
