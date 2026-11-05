import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.msg || 'Mali ang impormasyon');
    }
  };

  return (
    <div style={{ maxWidth: '420px', margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ color: '#FF6B95', fontSize: '2rem' }}>💖 Mineme</h1>
        <p>Maligayang pagbabalik!</p>
      </div>

      <div className="card">
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Mag-log in</h2>
        {error && <p style={{ color: '#E63946', textAlign: 'center' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
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
          <button type="submit" className="btn-red">Magpasok</button>
        </form>
      </div>

      <p style={{ textAlign: 'center', marginTop: '20px' }}>
        Wala pang account?{' '}
        <Link to="/register" style={{ color: '#FF6B95', fontWeight: '600' }}>
          Magrehistro
        </Link>
      </p>
    </div>
  );
}
