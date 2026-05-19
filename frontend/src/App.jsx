import './index.css';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";
import { useState } from "react";

// ── Komponen Layout ───────────────────────────────────────────────────────────
import AppNavbar from "./components/layout/AppNavbar";
import Sidebar from "./components/layout/Sidebar";
import StafSidebar from "./components/layout/StafSidebar";
import Footer from "./components/layout/Footer";

// ── Halaman Auth ──────────────────────────────────────────────────────────────
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

// ── Halaman Mahasiswa ─────────────────────────────────────────────────────────
import DashboardPage from "./pages/mahasiswa/DashboardPage";
import BuatTiketPage from "./pages/mahasiswa/BuatTiketPage";
import TiketSayaPage from "./pages/mahasiswa/TiketSayaPage";
import DetailTiketPage from "./pages/mahasiswa/DetailTiketPage";
import ChatbotPage from "./pages/mahasiswa/ChatbotPage";
import ProfilPage from "./pages/mahasiswa/ProfilPage";

// ── Halaman Staf ──────────────────────────────────────────────────────────────
import StafDashboardPage from "./pages/Staf/StafDashboardPage";
import TugasSayaPage from "./pages/Staf/TugasSayaPage";
import AntreanTiketPage from "./pages/Staf/AntreanTiketPage";
import DetailTiketStafPage from "./pages/Staf/DetailTiketStafPage";
import BuatTiketStafPage from "./pages/Staf/BuatTiketStafPage";
import ProfilStafPage from "./pages/Staf/ProfilStafPage";

// ── Halaman Admin ─────────────────────────────────────────────────────────────
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

// ── Layout Staf ───────────────────────────────────────────────────────────────
function StafLayout() {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  return (
    <div className="app-root">
      <AppNavbar user={user} onToggleSidebar={() => setIsSidebarOpen(p => !p)} />
      <div style={{ display: "flex", minHeight: "calc(100vh - 70px)" }}>
        <StafSidebar isOpen={isSidebarOpen} />
        <main style={{ flex: 1, background: "#f8fafc", overflowY: "auto" }}>
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}

// ── Layout Admin ──────────────────────────────────────────────────────────────
function AdminLayout() {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  return (
    <div className="app-root">
      <AppNavbar user={user} onToggleSidebar={() => setIsSidebarOpen(p => !p)} />
      <div style={{ display: "flex", minHeight: "calc(100vh - 70px)" }}>
        <StafSidebar isOpen={isSidebarOpen} />
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
      {/* ── Publik ── */}
      <Route path="/login" element={
        user ? <Navigate to={getDashboard(user.role)} replace /> : <LoginPage />
      } />
      <Route path="/register" element={
        user ? <Navigate to={getDashboard(user.role)} replace /> : <RegisterPage />
      } />
      {/* ── Preview Chatbot (tanpa login) ── */}
      <Route path="/chatbot-preview" element={<ChatbotPage />} />

      {/* ── Mahasiswa ── */}
      <Route element={
        <ProtectedRoute allowedRole="mahasiswa">
          <MahasiswaLayout />
        </ProtectedRoute>
      }>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/tiket/buat" element={<BuatTiketPage />} />
        <Route path="/tiket/saya" element={<TiketSayaPage />} />
        <Route path="/tiket/:id" element={<DetailTiketPage />} />
        <Route path="/chatbot" element={<ChatbotPage />} />
        <Route path="/profil" element={<ProfilPage />} />
      </Route>

      {/* ── Staf ── */}
      <Route element={
        <ProtectedRoute allowedRole="staf">
          <StafLayout />
        </ProtectedRoute>
      }>
        <Route path="/staff/dashboard" element={<StafDashboardPage />} />
        <Route path="/staff/tugas-saya" element={<TugasSayaPage />} />
        <Route path="/staff/antrean-tiket" element={<AntreanTiketPage />} />
        <Route path="/staff/buat-tiket" element={<BuatTiketStafPage />} />
        <Route path="/staff/tiket/:id" element={<DetailTiketStafPage />} />
        <Route path="/staff/profil" element={<ProfilStafPage />} />
      </Route>

      {/* ── Admin ── */}
      <Route element={
        <ProtectedRoute allowedRole="admin">
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
      </Route>

      {/* ── Default / Fallback ── */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

// ── App Root ──────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}