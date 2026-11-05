import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export default function Home() {
  const { user, refreshUser } = useAuth();
  const [dailyMsg, setDailyMsg] = useState('');
  const [codeInput, setCodeInput] = useState('');
  const [codeMsg, setCodeMsg] = useState('');

  // Claim Daily Bonus
  const claimDaily = async () => {
    try {
      const res = await axios.post('/api/user/daily-bonus');
      setDailyMsg(`✅ ${res.data.msg}`);
      await refreshUser();
    } catch (err) {
      setDailyMsg(`❌ ${err.response?.data?.msg || 'Error'}`);
    }
  };

  // Redeem Code
  const redeemCode = async (e) => {
    e.preventDefault();
    setCodeMsg('');
    try {
      const res = await axios.post('/api/codes/redeem', { code: codeInput });
      setCodeMsg(`✅ ${res.data.msg}`);
      setCodeInput('');
      await refreshUser();
    } catch (err) {
      setCodeMsg(`❌ ${err.response?.data?.msg || 'Hindi ma-redeem'}`);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h2>Kamusta, {user?.name || 'Kaibigan'}! 💖</h2>
        <p style={{ color: '#888' }}>Narito ang iyong balanse</p>
        <p className="balance-text">₱{user?.balance?.toFixed(2) || '0.00'}</p>
      </div>

      {/* Daily Bonus Card */}
      <div className="card">
        <h3>✨ Araw-araw na Bonus</h3>
        <p>Kumuha ng libreng ₱5 araw-araw!</p>
        <button onClick={claimDaily} className="btn-cream" style={{ width: '100%' }}>
          Kunin ang Bonus
        </button>
        {dailyMsg && <p style={{ marginTop: '10px', fontSize: '0.9rem' }}>{dailyMsg}</p>}
      </div>

      {/* Redeem Code Card */}
      <div className="card">
        <h3>🎟️ Palitan ang Code</h3>
        <form onSubmit={redeemCode}>
          <input
            type="text"
            placeholder="Ilagay ang code"
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
          />
          <button type="submit" className="btn-red" style={{ padding: '12px' }}>
            I-redeem
          </button>
        </form>
        {codeMsg && <p style={{ marginTop: '10px', fontSize: '0.9rem' }}>{codeMsg}</p>}
      </div>
    </div>
  );
}
