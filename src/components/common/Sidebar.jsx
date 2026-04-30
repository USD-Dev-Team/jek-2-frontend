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
  useBreakpointValue,
} from "@chakra-ui/react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  LucideLogOut,
  SunMoon,
} from "lucide-react";
import Cookies from "js-cookie";

import { useAuth } from "../../hooks/useAuth";
import { useAuthStore } from "../../store/authStore";
import { useUIStore } from "../../store/useUIStore";
import { useTranslation } from "react-i18next";
import LogoutModal from "./LogoutModal";
import LOGO from "/jek.png";

export default function Sidebar({ collapsed, links = [], role, end = false }) {
  const { t } = useTranslation();
  const { toggleColorMode } = useColorMode();
  const setCollapsed = useUIStore((s) => s.toggleSidebar);
  const { logout } = useAuth();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <>
      <Flex
        position="fixed"
        w={collapsed && !isMobile ? "70px" : "240px"}
        minH={{base:"95vh", md:"100vh"}}
        bg="darkblue"

        color="text"
        direction="column"
        justify="space-between"
        p={3}
        transition="all 0.3s ease"
        boxShadow="lg"
        top={{base:10, md:0}}
        zIndex={1000}
        left={isMobile ? (collapsed ? "-240px" : "0") : "0"}
      >
        <VStack alignItems={"center"}>
          {/* Logo */}
          <Flex justify="start" mb={4}>
            <Box
              mt={5}
              w={collapsed && !isMobile ? "0" : "70px"}
              h="45px"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Image rounded="100%" src={LOGO} alt="" />
            </Box>
          </Flex>

          {/* Toggle */}
          {!isMobile && (
            <Button
              position="absolute"
              right="0px"
              top="15px"
              size="sm"
              borderRadius="full"
              borderRightRadius={0}
              onClick={() => setCollapsed()}
            >
              {collapsed ? <ChevronRight /> : <ChevronLeft />}
            </Button>
          )}

          {/* Links */}
          <VStack align="stretch" spacing={1} w={"100%"}>
            {links.map((item) => {
              const label = item.labelKey ? t(item.labelKey) : item.label;

              return (
                <NavLink key={item.to} to={item.to} end={item.end}>
                  {({ isActive }) => (
                    <Tooltip label={collapsed ? label : ""} placement="right">
                      <Flex
                        align="center"
                        gap={2}
                        p={3}
                        borderRadius="lg"
                        bg={isActive ? "secondary" : "transparent"}
                        _hover={{ bg: "secondary", color: "white" }}
                        color={isActive ? "white" : "text"}
                        overflow="hidden"
                      >
                        <Icon as={item.icon} w={5} h={5} />
                        {!collapsed && (
                          <Text
                            whiteSpace="nowrap"
                            overflow="hidden"
                            textOverflow="ellipsis"
                          >
                            {label}
                          </Text>
                        )}
                      </Flex>
                    </Tooltip>
                  )}
                </NavLink>
              );
            })}
          </VStack>
        </VStack>

        {/* Bottom */}
        <VStack align="stretch">
          <Flex
            align="center"
            gap={2}
            p={2}
            borderRadius="md"
            _hover={{ bg: "secondary", color: "white" }}
            onClick={toggleColorMode}
            cursor="pointer"
          >
            <SunMoon size={20} />
            {!collapsed && <Text>{t("common.theme")}</Text>}
          </Flex>

          <Menu placement="right">
            <Tooltip label={collapsed ? Cookies.get("first_name") : ""}>
              <Flex alignItems={"center"}>
                <MenuButton w="100%">
                  <Flex align="center" gap={3} p={3}>
                    <Avatar
                      name={Cookies.get("first_name")}
                      size="sm"
                    />
                    {!collapsed && (
                      <Box>
                        <Text fontSize="sm" fontWeight="bold">
                          {Cookies.get("first_name")}
                        </Text>
                        <Text fontSize="xs">
                          {Cookies.get("role")}
                        </Text>
                      </Box>
                    )}
                  </Flex>
                </MenuButton>

                {!collapsed && <LogoutModal />}
              </Flex>
            </Tooltip>

            {collapsed && (
              <MenuList>
                <MenuItem icon={<LucideLogOut />} onClick={logout}>
                  {t("common.logout")}
                </MenuItem>
              </MenuList>
            )}
          </Menu>
        </VStack>
      </Flex>

      {/*  OVERLAY */}
      {isMobile && !collapsed && (
        <Box
          position="fixed"
          top="0"
          left="0"
          w="100vw"
          h="100vh"
          bg="blackAlpha.600"
          backdropFilter="blur(4px)"
          zIndex={999}
          onClick={() => setCollapsed()}
        />
      )}
    </>
  );
}