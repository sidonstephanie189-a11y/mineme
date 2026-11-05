import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAdmin } from './context/AdminContext';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import PlansPage from './pages/PlansPage';
import CodesPage from './pages/CodesPage';
import UsersPage from './pages/UsersPage';
import RequestsPage from './pages/RequestsPage';
import AdminNavbar from './components/AdminNavbar';

function App() {
  const { isAdmin, loading } = useAdmin();

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
          {/* Login page */}
          <Route path="/login" element={isAdmin ? <Navigate to="/dashboard" /> : <AdminLogin />} />

          {/* Protected admin pages */}
          <Route path="/dashboard" element={isAdmin ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/plans" element={isAdmin ? <PlansPage /> : <Navigate to="/login" />} />
          <Route path="/codes" element={isAdmin ? <CodesPage /> : <Navigate to="/login" />} />
          <Route path="/users" element={isAdmin ? <UsersPage /> : <Navigate to="/login" />} />
          <Route path="/requests" element={isAdmin ? <RequestsPage /> : <Navigate to="/login" />} />

          {/* Default redirect */}
          <Route path="*" element={<Navigate to={isAdmin ? "/dashboard" : "/login"} />} />
        </Routes>
        {isAdmin && <AdminNavbar />}
      </div>
    </Router>
  );
}

export default App;
