import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Plans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axios.get('/api/plans');
        setPlans(res.data);
      } catch (err) {
        setError('Hindi makita ang mga plano');
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>⌨️ Naglul…</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>📊 Mga Plano sa Kita</h2>
      {error && <p style={{ color: '#E63946', textAlign: 'center' }}>{error}</p>}

      {plans.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#888' }}>Wala pang nakalagay na plano</p>
      ) : (
        plans.map((plan) => (
          <div key={plan._id} className="card" style={{ borderLeft: '4px solid #FF6B95' }}>
            <h3>{plan.name}</h3>
            <p style={{ color: '#666' }}>{plan.description}</p>
            <p>💵 Minimum: <strong>₱{plan.minAmount}</strong></p>
            <p>💰 Araw-araw na kita: <strong>{plan.dailyROI}%</strong></p>
            <p>⏳ Tagal: <strong>{plan.durationDays} araw</strong></p>
          </div>
        ))
      )}
    </div>
  );
}
