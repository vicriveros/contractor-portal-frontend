import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

// Clients
import ClientList from './pages/clients/ClientList';
import ClientCreate from './pages/clients/ClientCreate';
import ClientEdit from './pages/clients/ClientEdit';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>

          <Route path="/login" element={<Login />} />

          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
          />

          {/* Client Routes */}
          <Route path="/clients" element={
            <ProtectedRoute>
              <ClientList />
            </ProtectedRoute>
          }
          />
          <Route path="/clients/create" element={
            <ProtectedRoute>
              <ClientCreate />
            </ProtectedRoute>
          }
          />
          <Route path="/clients/:id/edit" element={
            <ProtectedRoute>
              <ClientEdit />
            </ProtectedRoute>
          }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;