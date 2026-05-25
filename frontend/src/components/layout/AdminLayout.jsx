import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import AppNavbar from "./AppNavbar";
import StafSidebar from "./StafSidebar";
import Footer from "./Footer";

export default function AdminLayout() {
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
