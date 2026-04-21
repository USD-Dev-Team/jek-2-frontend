import {
  Box,
  Flex,
  Text,
  Icon,
  VStack,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Tooltip,
  useColorMode,
  Image,
} from "@chakra-ui/react";
import { NavLink, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, LucideLogOut, SunMoon } from "lucide-react";
import Cookies from "js-cookie";

import { useAuth } from "../../hooks/useAuth";
import { useAuthStore } from "../../store/authStore";
import { useUIStore } from "../../store/useUIStore";
import { useTranslation } from "react-i18next";
import LogoutModal from "./LogoutModal";
import LOGO from "/jek.png";

export default function Sidebar({ collapsed, links = [], role, end = false }) {
  const { t } = useTranslation(); // ✅ qo‘shildi
  const { toggleColorMode } = useColorMode();
  const setCollapsed = useUIStore((s) => s.toggleSidebar);
  const { logout } = useAuth();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  return (
    <Flex
      position="fixed"
      w={collapsed ? "70px" : "220px"}
      minH="100vh"
      bg="darkblue"
      color="text"
      direction="column"
      justify="space-between"
      p={3}
      transition="0.25s ease"
      boxShadow="lg"
      left={0}
      top={0}
      zIndex={1000}
    >
      <VStack alignItems={"center"}>
        {/* Logo */}
        <Flex justify="start" mb={4}>
          <Box
            mt={5}
            w={collapsed ? "0" : "70px"}
            h="45px"
            rounded="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
            color="white"
            fontWeight="bold"
            fontSize="md"
          >
            <Image rounded={"100%"} src={LOGO} alt="" />
          </Box>
        </Flex>

        {/* COLLAPSE TOGGLE BUTTON */}
        <Button
          position="absolute"
          right="0px"
          top="15px"
          size="sm"
          borderRadius="full"
          borderRightRadius={0}
          onClick={() => setCollapsed()}
          bg="darkblue"
          _hover={{ bg: "gray.500", color: "surface" }}
          color={"text"}
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </Button>

        {/* TOP LINKS */}
        <VStack align="stretch" spacing={1} w={"100%"}>
          {links.map((item) => {
            const label = item.labelKey ? t(item.labelKey) : item.label; // ✅ qo‘shildi

            return (
              <NavLink
                key={item.to}
                to={item.to}
                style={{ textDecoration: "none" }}
                end={item.end}
              >
                {({ isActive }) => (
                  <Tooltip label={collapsed ? label : ""} placement="right">
                    <Flex
                      align="center"
                      gap={2}
                      p={3}
                      borderRadius="lg"
                      bg={isActive ? "secondary" : "transparent"}
                      _hover={{ bg: "secondary", color: "white" }}
                      cursor="pointer"
                      transition="0.2s"
                      color={isActive ? "white" : "text"}
                    >
                      <Icon as={item.icon} w={5} h={5} />
                      {!collapsed && <Text fontWeight="medium">{label}</Text>}
                    </Flex>
                  </Tooltip>
                )}
              </NavLink>
            );
          })}
        </VStack>
      </VStack>

      <VStack align="stretch">
        <VStack spacing={1} py={3} align="stretch">
          {/* Theme Switch */}
          <Flex
            align="center"
            gap={collapsed ? 0 : 2}
            p={2}
            borderRadius="md"
            _hover={{ bg: "secondary", color: "white" }}
            onClick={() => toggleColorMode()}
            cursor="pointer"
          >
            <SunMoon size={20} />
            {!collapsed && <Text>{t("common.theme")}</Text>}
          </Flex>
        </VStack>

        {/* BOTTOM USER SECTION */}
        <Menu placement="right">
          <Tooltip label={collapsed ? Cookies.get('first_name                                                                               `') : ""} placement="right" openDelay={200}>
            <Flex alignItems={"center"}>
              <MenuButton
                onClick={() => {
                  // const path =
                  //role === "JEK"
                  //  ? "/account"
                  //  : role === "seller"
                  //    ? "/cafe/account"
                  //    : "/ombor/account";
                  navigate('Account');
                }}
                w="100%"
                cursor={collapsed ? "pointer" : "default"}
              >
                <Flex
                  align="center"
                  gap={3}
                  p={3}
                  borderRadius="lg"
                  _hover={{ bg: "gray.700" }}
                  transition="0.2s"
                >
                  <Avatar name={Cookies.get('first_name')} size="sm" bg="blue.500" color="white" />

                  {!collapsed && (
                    <Flex width={"100%"} alignItems={"center"} justifyContent={"space-between"}>
                      <Box>
                        <Text fontSize="sm" fontWeight="bold" lineHeight={1}>
                          {Cookies.get('first_name')}
                        </Text>
                        <Text fontSize="xs" color="gray.400">
                          {Cookies.get('role')}
                        </Text>
                      </Box>
                    </Flex>
                  )}
                </Flex>
              </MenuButton>

              {!collapsed ? <LogoutModal /> : <noscript />}
            </Flex>
          </Tooltip>

          {/* HOVER MENU */}
          {collapsed ? (
            <MenuList bg="surface" borderColor="border">
              <MenuItem
                icon={<LucideLogOut />}
                bg="surface"
                _hover={{ bg: "red.300", color: "red" }}
                onClick={logout}
              >
                {t("common.logout")}
              </MenuItem>
            </MenuList>
          ) : (
            <noscript />
          )}
        </Menu>
      </VStack>
    </Flex>
  );
}