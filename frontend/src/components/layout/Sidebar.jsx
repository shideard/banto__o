import { useState, useEffect } from "react";
import BaseSidebar from "./BaseSidebar";
import { useAuth } from "../../hooks/useAuth";
import ticketService from "../../services/ticketService";

const MENU_ITEMS = [
  { to: "/dashboard",        icon: "LayoutDashboard", label: "Dashboard" },
  { to: "/tiket/saya",       icon: "Ticket",          label: "Tiket Saya", badgeKey: "myTickets" },
  { to: "/tiket/buat",       icon: "PlusCircle",      label: "Buat Tiket" },
  { to: "/chatbot",          icon: "MessageCircle",   label: "Chatbot" },
];

const AKUN_ITEMS = [
  { to: "/profil", icon: "UserCircle", label: "Profil Saya" },
];

export default function Sidebar({ isOpen = true }) {
  const { user, token } = useAuth();
  const [badgeData, setBadgeData] = useState({ myTickets: 0 });

  useEffect(() => {
    if (!user || !token) {
      return; // Skip fetch if no user or token
    }

    const fetchBadgeData = async () => {
      try {
        const tickets = await ticketService.getMyTickets();
        setBadgeData({ myTickets: Array.isArray(tickets) ? tickets.length : 0 });
      } catch (error) {
        console.error("Error fetching badge data:", error);
        // Don't retry on error - let ApiClient interceptor handle it
      }
    };

    fetchBadgeData();
  }, [user, token]);

  // Add badge values to menu items
  const menuItemsWithBadges = MENU_ITEMS.map((item) => ({
    ...item,
    badge: item.badgeKey ? badgeData[item.badgeKey] : undefined,
  }));

  return (
    <BaseSidebar
      isOpen={isOpen}
      menuItems={menuItemsWithBadges}
      accountItems={AKUN_ITEMS}
    />
  );
}