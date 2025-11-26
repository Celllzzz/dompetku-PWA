import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import PWABadge from './PWABadge';
import { ToastProvider } from './context/ToastContext';
import { ConfirmProvider } from './context/ConfirmContext';
import { AuthProvider, useAuth } from './context/AuthContext'; // Import Auth

// Pages
import SplashScreen from './pages/SplashScreen';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import AddTransaction from './pages/AddTransaction';
import Categories from './pages/Categories';
import Profile from './pages/Profile';
import TransactionDetail from './pages/TransactionDetail';
import EditTransaction from './pages/EditTransaction';
import CategoryForm from './pages/CategoryForm';

// Komponen Pembungkus untuk Proteksi Route
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null; // Tunggu cek localStorage selesai
  if (!user) return <Navigate to="/login" />; // Kalau gak ada user, tendang ke login
  return <Layout>{children}</Layout>; // Kalau ada, tampilkan Layout & Halaman
};

function AppContent() {
  const [splashFinished, setSplashFinished] = useState(false);
  const { loading } = useAuth();

  // Tampilkan Splash Screen dulu
  if (!splashFinished) {
    return <SplashScreen onFinish={() => setSplashFinished(true)} />;
  }

  // Setelah splash, jika loading auth masih jalan, tampilkan kosong/loading
  if (loading) return null;

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen shadow-xl relative">
      <Routes>
        {/* Public Routes (Boleh diakses tanpa login) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes (Harus login) */}
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
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
      <AuthProvider> {/* AuthProvider paling luar */}
        <ToastProvider>
          <ConfirmProvider>
             <AppContent />
          </ConfirmProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}