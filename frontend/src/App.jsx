import './index.css'
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";
import { useState } from "react";

// Layout
import AppNavbar from "./components/layout/AppNavbar";
import Sidebar from "./components/layout/Sidebar";
import Footer from "./components/layout/Footer";

// Halaman Auth
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

// Halaman Mahasiswa
import DashboardPage from "./pages/mahasiswa/DashboardPage";
import BuatTiketPage from "./pages/mahasiswa/BuatTiketPage";
import TiketSayaPage from "./pages/mahasiswa/TiketSayaPage";
import ChatbotPage from "./pages/mahasiswa/ChatbotPage";

// Halaman Staf
import StafDashboardPage from "./pages/Staf/StafDashboardPage";


// Halaman Admin
import AdminDashboardPage from "./pages/Admin/AdminDashboardPage";

// ── Helper redirect berdasarkan role ─────────────────────────────────────────
function getDashboard(role) {
  if (role === "staf") return "/staff/dashboard";
  if (role === "admin") return "/admin/dashboard";
  return "/dashboard";
}

// ── Layout Mahasiswa ──────────────────────────────────────────────────────────
function MahasiswaLayout() {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  return (
    <div className="app-root">
      <AppNavbar user={user} onToggleSidebar={() => setIsSidebarOpen(p => !p)} />
      <div style={{ display: "flex", minHeight: "calc(100vh - 70px)" }}>
        <Sidebar isOpen={isSidebarOpen} />
        <main style={{ flex: 1, background: "#f8fafc", overflowY: "auto" }}>
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}

// ── Layout Staf & Admin ───────────────────────────────────────────────────────
function StafLayout() {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  return (
    <div className="app-root">
      <AppNavbar user={user} onToggleSidebar={() => setIsSidebarOpen(p => !p)} />
      <div style={{ display: "flex", minHeight: "calc(100vh - 70px)" }}>
        <Sidebar isOpen={isSidebarOpen} />
        <main style={{ flex: 1, background: "#f8fafc", overflowY: "auto" }}>
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}

// ── Protected Route ───────────────────────────────────────────────────────────
function ProtectedRoute({ children, allowedRole }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRole && user.role !== allowedRole) return <Navigate to="/login" replace />;
  return children;
}

// ── Routes ────────────────────────────────────────────────────────────────────
function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      {/* Publik */}
      <Route path="/login" element={
        user ? <Navigate to={getDashboard(user.role)} replace /> : <LoginPage />
      } />
      <Route path="/register" element={
        user ? <Navigate to={getDashboard(user.role)} replace /> : <RegisterPage />
      } />

      {/* Mahasiswa */}
      <Route element={
        <ProtectedRoute allowedRole="mahasiswa">
          <MahasiswaLayout />
        </ProtectedRoute>
      }>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/tiket/buat" element={<BuatTiketPage />} />
        <Route path="/tiket/saya" element={<TiketSayaPage />} />
        <Route path="/chatbot" element={<ChatbotPage />} />
      </Route>

      {/* Staf */}
      <Route element={
        <ProtectedRoute allowedRole="staf">
          <StafLayout />
        </ProtectedRoute>
      }>
        <Route path="/staff/dashboard" element={<StafDashboardPage />} />
      </Route>

      {/* Admin */}
      <Route element={
        <ProtectedRoute allowedRole="admin">
          <StafLayout />
        </ProtectedRoute>
      }>
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
      </Route>

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
