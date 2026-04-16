import { Outlet } from "react-router";
import Sidebar from "../components/common/Sidebar";
import { Box } from "@chakra-ui/react";
import { useUIStore } from "../store/useUIStore";
import { LayoutDashboard, MessageSquare, User, Users, Users2 } from "lucide-react";
import Header from "../components/common/Header";

const links = [
  { labelKey: "nav.dashboard", to: "/Government/Dashboard", icon: LayoutDashboard },
  { labelKey: "nav.appeals", to: "/Government/Murojatlar", icon: MessageSquare },
  { labelKey: "JEK Hodimlari", to: "/Government/Hodimlar", icon: Users },
  { labelKey: "Inspeksiya Hodimlari", to: "/Government/Inspectionslar", icon: User },
];

export default function GovernmentLoyout() {
  const { collapsed } = useUIStore();

  return (
    <Box>
      <Sidebar collapsed={collapsed} links={links} role={"GOVERNMENT"} />
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