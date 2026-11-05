import { useState, useEffect } from 'react';
import axios from 'axios';

export default function PlansPage() {
  const [plans, setPlans] = useState([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    minAmount: '',
    maxAmount: '',
    dailyROI: '',
    durationDays: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [msg, setMsg] = useState('');

  const fetchPlans = async () => {
    const res = await axios.get('/api/plans');
    setPlans(res.data);
  };

  useEffect(() => { fetchPlans(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      if (editingId) {
        await axios.put(`/api/plans/${editingId}`, form);
        setMsg('✅ Plan na-update na!');
      } else {
        await axios.post('/api/plans', form);
        setMsg('✅ Bagong plan naitago na!');
      }
      setForm({ name: '', description: '', minAmount: '', maxAmount: '', dailyROI: '', durationDays: '' });
      setEditingId(null);
      fetchPlans();
    } catch (err) {
      setMsg('❌ May naganap na error');
    }
  };

  const handleEdit = (plan) => {
    setForm({
      name: plan.name,
      description: plan.description,
      minAmount: plan.minAmount,
      maxAmount: plan.maxAmount,
      dailyROI: plan.dailyROI,
      durationDays: plan.durationDays
    });
    setEditingId(plan._id);
  };

  const handleDelete = async (id) => {
    if (!confirm('Sigurado ka bang burahin ito?')) return;
    try {
      await axios.delete(`/api/plans/${id}`);
      setMsg('✅ Plan naitago na!');
      fetchPlans();
    } catch (err) {
      setMsg('❌ Hindi mabura');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>📈 Pamahalaan ang mga Plano</h1>

      <div className="card">
        <h3>{editingId ? 'I-update ang Plano' : 'Magdagdag ng Bagong Plano'}</h3>
        {msg && <p style={{ color: '#10B981', marginBottom: '10px' }}>{msg}</p>}
        <form onSubmit={handleSubmit}>
          <input placeholder="Pangalan ng Plano" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required />
          <input placeholder="Paglalarawan" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} />
          <input type="number" placeholder="Pinakamababang Halaga" value={form.minAmount} onChange={(e) => setForm({...form, minAmount: e.target.value})} required />
          <input type="number" placeholder="Pinakamataas na Halaga" value={form.maxAmount} onChange={(e) => setForm({...form, maxAmount: e.target.value})} />
          <input type="number" step="0.01" placeholder="Araw-araw na Kita (%)" value={form.dailyROI} onChange={(e) => setForm({...form, dailyROI: e.target.value})} required />
          <input type="number" placeholder="Tagal (Araw)" value={form.durationDays} onChange={(e) => setForm({...form, durationDays: e.target.value})} required />
          <button type="submit" className="btn-primary">{editingId ? 'I-update' : 'Magdagdag'}</button>
          {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({name:'',description:'',minAmount:'',maxAmount:'',dailyROI:'',durationDays:''}); setMsg(''); }} style={{width:'100%',marginTop:'8px',background:'#555',color:'white',border:'none',padding:'10px',borderRadius:'8px'}}>Kanselahin</button>}
        </form>
      </div>

      <div className="card">
        <h3>Listahan ng mga Plano</h3>
        {plans.length === 0 ? <p style={{color:'#AAA'}}>Wala pang plano</p> : (
          plans.map(p => (
            <div key={p._id} style={{padding:'12px 0',borderBottom:'1px solid #444'}}>
              <h4>{p.name}</h4>
              <p style={{fontSize:'0.85rem',color:'#AAA'}}>{p.description}</p>
              <p>Min: ₱{p.minAmount} | Araw-araw: {p.dailyROI}% | {p.durationDays} araw</p>
              <button className="btn-success" onClick={() => handleEdit(p)}>Baguhin</button>
              <button className="btn-danger" onClick={() => handleDelete(p._id)}>Burahin</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
