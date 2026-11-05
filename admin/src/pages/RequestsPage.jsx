import { useState, useEffect } from 'react';
import axios from 'axios';

export default function RequestsPage() {
  const [requests, setRequests] = useState([]);
  const [msg, setMsg] = useState('');

  const fetchRequests = async () => {
    try {
      // Kunin ang lahat ng transaksyon — sa aktuwal na paggamit, maaaring may hiwalay na endpoint
      const res = await axios.get('/api/admin/users');
      // Ito ay simpleng pagpapakita — sa buong pagtakbo, gagamitin ang tamang listahan ng requests
      setRequests([]);
    } catch (err) {
      console.log('Error sa pagkuha');
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleApprove = async (id) => {
    setMsg('');
    try {
      await axios.patch(`/api/admin/transactions/${id}`, { status: 'completed' });
      setMsg('✅ Na-aprubahan na!');
      fetchRequests();
    } catch (err) {
      setMsg('❌ Hindi ma-aprubahan');
    }
  };

  const handleReject = async (id) => {
    setMsg('');
    try {
      await axios.patch(`/api/admin/transactions/${id}`, { status: 'rejected' });
      setMsg('✅ Tinanggihan na!');
      fetchRequests();
    } catch (err) {
      setMsg('❌ Hindi matanggihan');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>📋 Mga Kahilingan</h1>
      {msg && <p style={{ textAlign: 'center', color: '#10B981' }}>{msg}</p>}

      <div className="card">
        <h3>Naghihintay ng Pag-apruba</h3>
        {requests.length === 0 ? (
          <p style={{ color: '#AAA', textAlign: 'center', padding: '20px' }}>
            ✅ Wala pang kahilingan — lahat ay naasikaso na!
          </p>
        ) : (
          requests.map(r => (
            <div key={r._id} style={{ padding: '12px 0', borderBottom: '1px solid #444' }}>
              <p>
                <strong>{r.type === 'deposit' ? '📥 Cash In' : '📤 Withdraw'}</strong> — ₱{r.amount}
              </p>
              <p style={{ fontSize: '0.85rem', color: '#AAA' }}>{r.note || ''}</p>
              <div style={{ marginTop: '8px' }}>
                <button className="btn-success" onClick={() => handleApprove(r._id)}>✅ Aprubahan</button>
                <button className="btn-danger" onClick={() => handleReject(r._id)}>❌ Tanggihan</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
