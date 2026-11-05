import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Plans from './pages/Plans';
import Wallet from './pages/Wallet';
import Profile from './pages/Profile';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <h2>⌨️ Naglul…</h2>
      </div>
    );
  }

  return (
    <Router>
      <div className="page-container">
        <Routes>
          {/* Pampublikong pahina */}
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />

          {/* Pahinang kailangan ng pagpasok */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
        {user && <Navbar />}
      </div>
    </Router>
  );
}

export default App;
