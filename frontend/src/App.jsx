// main.jsx
import './index.css'
import LoginPage from './pages/auth/LoginPage'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";

// Import semua komponen page
import BuatTiketPage from "./pages/mahasiswa/BuatTiketPage";
import DashboardPage from "./pages/mahasiswa/DashboardPage";
import ChatbotPage from "./pages/mahasiswa/ChatbotPage";
import TiketSayaPage from "./pages/mahasiswa/TiketSayaPage"; // <--- IMPORT INI

function ProtectedRoute({ children, allowedRole }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRole && user.role !== allowedRole) return <Navigate to="/login" replace />;
  return children;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to={user.role === "mahasiswa" ? "/dashboard" : "/staff/dashboard"} replace /> : <LoginPage />} />

      {/* Rute Mahasiswa */}
      <Route path="/dashboard" element={
        <ProtectedRoute allowedRole="mahasiswa">
          <DashboardPage />
        </ProtectedRoute>
      } />
      
      <Route path="/tiket/buat" element={
        <ProtectedRoute allowedRole="mahasiswa">
          <BuatTiketPage />
        </ProtectedRoute>
      } />

      {/* Tambahkan Route Tiket Saya di sini */}
      <Route path="/tiket/saya" element={
        <ProtectedRoute allowedRole="mahasiswa">
          <TiketSayaPage />
        </ProtectedRoute>
      } />

      <Route path="/chatbot" element={
        <ProtectedRoute allowedRole="mahasiswa">
          <ChatbotPage />
        </ProtectedRoute>
      } />

      {/* Rute Staff */}
      <Route path="/staff/dashboard" element={
        <ProtectedRoute allowedRole="staff">
          <div style={{ padding: "40px" }}>Dashboard Staff — coming soon</div>
        </ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}