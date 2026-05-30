import './index.css';
import pageStyles from "./styles/pageStyles";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import { NotificationProvider } from "./context/NotificationContext";

import { ToastProvider } from "./components/ui/Toast";

import { useAuth } from "./hooks/useAuth";



// ── Komponen Layout ───────────────────────────────────────────────────────────

import MahasiswaLayout from "./components/layout/MahasiswaLayout";

import StafLayout from "./components/layout/StafLayout";



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

import StafDashboardPage from "./pages/staf/StafDashboardPage";

import TugasSayaPage from "./pages/staf/TugasSayaPage";

import AntreanTiketPage from "./pages/staf/AntreanTiketPage";

import DetailTiketStafPage from "./pages/staf/DetailTiketStafPage";

import BuatTiketStafPage from "./pages/staf/BuatTiketStafPage";

import ProfilStafPage from "./pages/staf/ProfilStafPage";





// ── Helper redirect berdasarkan role ─────────────────────────────────────────

function getDashboard(role) {

  if (role === "staf") return "/staff/dashboard";

  return "/dashboard";

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



      {/* ── Default / Fallback ── */}

      <Route path="*" element={<Navigate to="/login" replace />} />

    </Routes>

  );

}



// ── App Root ──────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <>
      <style>{pageStyles}</style>
      <BrowserRouter>
        <AuthProvider>
          <NotificationProvider>
            <ToastProvider>
              <AppRoutes />
            </ToastProvider>
          </NotificationProvider>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

