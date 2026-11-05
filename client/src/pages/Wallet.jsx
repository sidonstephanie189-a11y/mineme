import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export default function Wallet() {
  const { user, refreshUser } = useAuth();
  const [history, setHistory] = useState([]);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('GCash');
  const [actionType, setActionType] = useState('deposit');
  const [msg, setMsg] = useState('');

  // Kunin ang kasaysayan
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get('/api/wallet/history');
        setHistory(res.data);
      } catch (err) {
        console.log('Hindi makita ang kasaysayan');
      }
    };
    fetchHistory();
  }, []);

  // Magpadala ng request
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    const num = Number(amount);
    if (!num || num <= 0) {
      setMsg('❌ Ilagay ang tamang halaga');
      return;
    }

    try {
      const endpoint = actionType === 'deposit' ? '/api/wallet/recharge' : '/api/wallet/withdraw';
      await axios.post(endpoint, { amount: num, method });
      setMsg('✅ Naipadala na ang request! Hintayin ang approval.');
      setAmount('');
      await refreshUser();
    } catch (err) {
      setMsg(`❌ ${err.response?.data?.msg || 'May naganap na error'}`);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '12px' }}>💰 Pitaka</h2>
      <p className="balance-text" style={{ textAlign: 'center', marginBottom: '24px' }}>
        ₱{user?.balance?.toFixed(2) || '0.00'}
      </p>

      {/* Pagpili: Deposit o Withdraw */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button
          onClick={() => setActionType('deposit')}
          className={actionType === 'deposit' ? 'btn-red' : 'btn-cream'}
          style={{ flex: 1 }}
        >
          Cash In
        </button>
        <button
          onClick={() => setActionType('withdraw')}
          className={actionType === 'withdraw' ? 'btn-dark' : 'btn-cream'}
          style={{ flex: 1 }}
        >
          Withdraw
        </button>
      </div>

      {/* Form */}
      <div className="card">
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            placeholder="Halaga"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          {actionType === 'deposit' && (
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 18px',
                border: '2px solid #FFE6EE',
                borderRadius: '14px',
                marginBottom: '12px',
                fontSize: '1rem'
              }}
            >
              <option>GCash</option>
              <option>Maya</option>
              <option>Bank Transfer</option>
            </select>
          )}
          <button
            type="submit"
            className={actionType === 'deposit' ? 'btn-red' : 'btn-dark'}
          >
            {actionType === 'deposit' ? 'Magpadala ng Cash In' : 'Magpadala ng Withdraw'}
          </button>
        </form>
        {msg && <p style={{ marginTop: '14px', textAlign: 'center' }}>{msg}</p>}
      </div>

      {/* Kasaysayan */}
      <div className="card">
        <h3 style={{ marginBottom: '12px' }}>📋 Kasaysayan</h3>
        {history.length === 0 ? (
          <p style={{ color: '#888', textAlign: 'center' }}>Wala pang transaksyon</p>
        ) : (
          history.map((tx) => (
            <div
              key={tx._id}
              style={{
                padding: '10px 0',
                borderBottom: '1px solid #FFE6EE',
                display: 'flex',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <span style={{ fontWeight: '600' }}>
                  {tx.type === 'deposit' && '📥'}
                  {tx.type === 'withdraw' && '📤'}
                  {tx.type === 'bonus' && '🎁'}
                  {tx.type === 'code' && '🎟️'}
                  {' '}{tx.type}
                </span>
                <p style={{ fontSize: '0.85rem', color: '#888' }}>{tx.note || ''}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <strong>₱{tx.amount.toFixed(2)}</strong>
                <p style={{
                  fontSize: '0.75rem',
                  color: tx.status === 'pending' ? '#F59E0B' : '#10B981'
                }}>
                  {tx.status}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
