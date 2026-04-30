import { Outlet } from "react-router";
import Sidebar from "../components/common/Sidebar";
import { Box, useBreakpointValue } from "@chakra-ui/react";
import { useUIStore } from "../store/useUIStore";
import { LayoutDashboard, MessageSquare, Users } from "lucide-react";
import Header from "../components/common/Header";

const links = [
  { labelKey: "nav.dashboard", to: "/INSPECTION/Dashboard", icon: LayoutDashboard },
  { labelKey: "nav.appeals", to: "/INSPECTION/Murojatlar", icon: MessageSquare },
  { labelKey: "nav.jekEmployees", to: "/INSPECTION/Hodimlar", icon: Users },
];

export default function InspectiontLoyout() {
  const { collapsed } = useUIStore();
    const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box>
      <Sidebar collapsed={collapsed} links={links} role={"INSPECTION"} />
      <Box
              pl={isMobile ? "20px" : collapsed ? "80px" : "250px"}
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