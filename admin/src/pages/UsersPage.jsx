import { useState, useEffect } from 'react';
import axios from 'axios';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [adjustForm, setAdjustForm] = useState({ userId: '', amount: '', note: '' });
  const [msg, setMsg] = useState('');

  const fetchUsers = async () => {
    const res = await axios.get('/api/admin/users');
    setUsers(res.data);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleAdjust = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      await axios.patch(`/api/admin/users/${adjustForm.userId}/adjust`, {
        amount: Number(adjustForm.amount),
        note: adjustForm.note
      });
      setMsg('✅ Balanse na-update na!');
      setAdjustForm({ userId: '', amount: '', note: '' });
      fetchUsers();
    } catch (err) {
      setMsg('❌ Hindi ma-update ang balanse');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>👥 Pamahalaan ang mga Miyembro</h1>

      <div className="card">
        <h3>I-adjust ang Balanse</h3>
        {msg && <p style={{ color: '#10B981' }}>{msg}</p>}
        <form onSubmit={handleAdjust}>
          <select
            value={adjustForm.userId}
            onChange={(e) => setAdjustForm({ ...adjustForm, userId: e.target.value })}
            required
          >
            <option value="">Pumili ng miyembro</option>
            {users.map(u => (
              <option key={u._id} value={u._id}>
                {u.name} — ₱{u.balance?.toFixed(2)}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Halaga (+ para dagdag, - para bawas)"
            value={adjustForm.amount}
            onChange={(e) => setAdjustForm({ ...adjustForm, amount: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Dahil / Tala"
            value={adjustForm.note}
            onChange={(e) => setAdjustForm({ ...adjustForm, note: e.target.value })}
          />
          <button type="submit" className="btn-primary">I-update ang Balanse</button>
        </form>
      </div>

      <div className="card">
        <h3>Lahat ng Miyembro ({users.length})</h3>
        {users.length === 0 ? (
          <p style={{ color: '#AAA' }}>Wala pang miyembro</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Pangalan</th>
                  <th>Email</th>
                  <th>Balanse</th>
                  <th>Katayuan</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id}>
                    <td style={{ fontWeight: '600' }}>{u.name}</td>
                    <td style={{ fontSize: '0.85rem' }}>{u.email}</td>
                    <td style={{ color: '#FFD700', fontWeight: '600' }}>
                      ₱{u.balance?.toFixed(2) || '0.00'}
                    </td>
                    <td>
                      {u.role === 'admin' ? (
                        <span style={{ color: '#FFD700' }}>👑 Admin</span>
                      ) : (
                        <span style={{ color: '#10B981' }}>Miyembro</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
