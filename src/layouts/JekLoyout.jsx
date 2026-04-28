import { Outlet } from "react-router";
import Sidebar from "../components/common/Sidebar";
import { Box } from "@chakra-ui/react";
import { useUIStore } from "../store/useUIStore";
import { LayoutDashboard, MessageCircleDashed, MessageSquare } from "lucide-react";
import Header from "../components/common/Header";

const links = [
  { labelKey: "nav.dashboard", to: "/jek/Dashboard", icon: LayoutDashboard },
  { labelKey: "nav.appeals", to: "/jek/Murojatlar", icon: MessageSquare },
  { labelKey: "nav.myAppeals", to: "/jek/Mening-murojatlarim", icon: MessageCircleDashed },
];

export default function JekLayout() {
  const { collapsed } = useUIStore();

  return (
    <Box>
      <Sidebar collapsed={collapsed} links={links} role={"JEK"} />
      <Box
        pl={collapsed ? "80px" : "250px"}
        pt={"80px"}
        pr={"23px"}
        transition="0.25s ease"
        minH="100vh"
      >
        <Header />
        <Outlet />
      </Box>
    </Box>
  );
}