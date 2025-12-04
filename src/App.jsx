import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import PWABadge from './PWABadge';
import { ToastProvider } from './context/ToastContext';
import { ConfirmProvider } from './context/ConfirmContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import SplashScreen from './pages/SplashScreen';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import HistoryPage from './pages/HistoryPage'; // Import Halaman History
import AddTransaction from './pages/AddTransaction';
import Categories from './pages/Categories';
import Profile from './pages/Profile';
import TransactionDetail from './pages/TransactionDetail';
import EditTransaction from './pages/EditTransaction';
import CategoryForm from './pages/CategoryForm';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null; 
  if (!user) return <Navigate to="/login" />;
  return <Layout>{children}</Layout>;
};

function AppContent() {
  const [splashFinished, setSplashFinished] = useState(false);
  const { loading } = useAuth();

  if (!splashFinished) return <SplashScreen onFinish={() => setSplashFinished(true)} />;
  if (loading) return null;

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} /> {/* Route Baru */}
        <Route path="/add" element={<ProtectedRoute><AddTransaction /></ProtectedRoute>} />
        <Route path="/transaction/:id" element={<ProtectedRoute><TransactionDetail /></ProtectedRoute>} />
        <Route path="/transaction/edit/:id" element={<ProtectedRoute><EditTransaction /></ProtectedRoute>} />
        <Route path="/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
        <Route path="/categories/add" element={<ProtectedRoute><CategoryForm /></ProtectedRoute>} />
        <Route path="/categories/edit/:id" element={<ProtectedRoute><CategoryForm /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Routes>
      <PWABadge />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <ConfirmProvider>
             <AppContent />
          </ConfirmProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}