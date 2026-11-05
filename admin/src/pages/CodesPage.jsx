import { useState, useEffect } from 'react';
import axios from 'axios';

export default function CodesPage() {
  const [codes, setCodes] = useState([]);
  const [form, setForm] = useState({ code: '', value: '', usageLimit: '1' });
  const [msg, setMsg] = useState('');

  const fetchCodes = async () => {
    const res = await axios.get('/api/admin/codes');
    setCodes(res.data);
  };

  useEffect(() => { fetchCodes(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      await axios.post('/api/admin/codes', {
        code: form.code.toUpperCase(),
        value: Number(form.value),
        usageLimit: Number(form.usageLimit)
      });
      setMsg('✅ Code naitago na!');
      setForm({ code: '', value: '', usageLimit: '1' });
      fetchCodes();
    } catch (err) {
      setMsg('❌ Hindi makagawa ng code — maaaring may kapangalan na');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>🎟️ Pamahalaan ang mga Code</h1>

      <div className="card">
        <h3>Gumawa ng Bagong Code</h3>
        {msg && <p style={{ color: '#10B981' }}>{msg}</p>}
        <form onSubmit={handleSubmit}>
          <input placeholder="Code (hal. BONUS50)" value={form.code} onChange={(e) => setForm({...form, code: e.target.value})} required />
          <input type="number" placeholder="Halaga (hal. 50)" value={form.value} onChange={(e) => setForm({...form, value: e.target.value})} required />
          <input type="number" placeholder="Bilang ng paggamit" value={form.usageLimit} onChange={(e) => setForm({...form, usageLimit: e.target.value})} required />
          <button type="submit" className="btn-primary">Gumawa ng Code</button>
        </form>
      </div>

      <div className="card">
        <h3>Lahat ng Code</h3>
        {codes.length === 0 ? <p style={{color:'#AAA'}}>Wala pang code</p> : (
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Halaga</th>
                <th>Gamit</th>
                <th>Katayuan</th>
              </tr>
            </thead>
            <tbody>
              {codes.map(c => (
                <tr key={c._id}>
                  <td style={{fontWeight:'600',color:'#FFD700'}}>{c.code}</td>
                  <td>₱{c.value}</td>
                  <td>{c.usedCount}/{c.usageLimit}</td>
                  <td>
                    {c.usedCount >= c.usageLimit ? <span style={{color:'#EF4444'}}>Ubos na</span> : <span style={{color:'#10B981'}}>Buhay</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
