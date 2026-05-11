// App.jsx
import './index.css'
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";
import { useState } from "react";
// Import Komponen Layout
import AppNavbar from "./components/layout/AppNavbar";
import Sidebar from "./components/layout/Sidebar";
import Footer from "./components/layout/Footer";

// Import Halaman
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import DashboardPage from "./pages/mahasiswa/DashboardPage";
import BuatTiketPage from "./pages/mahasiswa/BuatTiketPage";
import TiketSayaPage from "./pages/mahasiswa/TiketSayaPage";
import ChatbotPage from "./pages/mahasiswa/ChatbotPage";

// --- LAYOUT MAHASISWA ---
function MahasiswaLayout() {
  const { user } = useAuth();
  // State untuk kontrol buka-tutup sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  return (
    <div className="app-root">
      {/* Kirim fungsi toggle ke Navbar */}
      <AppNavbar user={user} onToggleSidebar={toggleSidebar} />
      
      <div style={{ display: "flex", minHeight: "calc(100vh - 70px)" }}>
        {/* Kirim status isOpen ke Sidebar */}
        <Sidebar isOpen={isSidebarOpen} /> 
        
        <main style={{ 
          flex: 1, 
          background: "#f8fafc", 
          overflowY: "auto",
          transition: "margin-left 0.3s ease" // Animasi halus saat sidebar geser
        }}>
          <Outlet /> 
        </main>
      </div>
      <Footer />
    </div>
  );
}

// --- PROTECTED ROUTE GUARD ---
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
      {/* Rute Publik */}
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />

      {/* Rute Mahasiswa (Terbungkus Layout & Protection) */}
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

      {/* Rute Staf */}
      <Route path="/staf/dashboard" element={
        <ProtectedRoute allowedRole="staf">
          <div style={{ padding: "40px" }}>Dashboard Staf — coming soon</div>
        </ProtectedRoute>
      } />

      {/* Default Redirect */}
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