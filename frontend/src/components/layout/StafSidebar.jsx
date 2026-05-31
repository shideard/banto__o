import { useState, useEffect } from "react";
import BaseSidebar from "./BaseSidebar";
import { useAuth } from "../../hooks/useAuth";
import ticketService from "../../services/ticketService";

const MENU_ITEMS = [
  { to: "/staff/dashboard",     icon: "LayoutDashboard", label: "Dashboard" },
  { to: "/staff/tugas-saya",    icon: "Ticket",          label: "Tiket Saya", badgeKey: "myTickets" },
  { to: "/staff/antrean-tiket", icon: "ClipboardList",   label: "Antrean Tiket", badgeKey: "unclaimedTickets", badgeClass: "orange" },
];

const AKUN_ITEMS = [
  { to: "/staff/profil", icon: "UserCircle", label: "Profil Saya" },
];

export default function StafSidebar({ isOpen = true }) {
  const { user, token } = useAuth();
  const [badgeData, setBadgeData] = useState({ myTickets: 0, unclaimedTickets: 0 });

  useEffect(() => {
    if (!user || !token) {
      return; // Skip fetch if no user or token
    }

    const fetchBadgeData = async () => {
      try {
        const myTickets = await ticketService.getMyTickets();
        const unclaimedTickets = await ticketService.getUnclaimedTickets();
        
        setBadgeData({
          myTickets: Array.isArray(myTickets) ? myTickets.length : 0,
          unclaimedTickets: Array.isArray(unclaimedTickets) ? unclaimedTickets.length : 0,
        });
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