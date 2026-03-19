// main.jsx
import './index.css'
import PublicNavbar from './components/layout/PublicNavbar'
import Footer from './components/layout/Footer'
import LoginPage from './pages/auth/LoginPage'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";
import BuatTiketPage from "./pages/mahasiswa/BuatTiketPage";


// Route guard — redirect ke login kalau belum login
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
      {/* Public */}
      <Route path="/login" element={user ? <Navigate to={user.role === "mahasiswa" ? "/dashboard" : "/staff/dashboard"} replace /> : <LoginPage />} />

      {/* Mahasiswa */}
      <Route path="/dashboard" element={
        <ProtectedRoute allowedRole="mahasiswa">
          <div style={{ padding: "40px" }}>Dashboard Mahasiswa — coming soon</div>
        </ProtectedRoute>
      } />
      <Route path="/tiket/buat" element={
        <ProtectedRoute allowedRole="mahasiswa">
          <BuatTiketPage />
        </ProtectedRoute>
      } />

      {/* Staff */}
      <Route path="/staff/dashboard" element={
        <ProtectedRoute allowedRole="staff">
          <div style={{ padding: "40px" }}>Dashboard Staff — coming soon</div>
        </ProtectedRoute>
      } />

      {/* Default */}
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