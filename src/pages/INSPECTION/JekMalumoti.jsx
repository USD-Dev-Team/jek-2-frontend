import {
  Badge,
  Button,
  Collapse,
  Divider,
  Flex,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  Switch,
  Text,
  useColorModeValue,
  useDisclosure,
  VStack,
  InputGroup,
  InputRightElement,
  IconButton,
  SimpleGrid,
  Box,
  Select,
  Icon,
  Tooltip,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { apiJekData } from "../../Services/api/Jekdata";
import { useTranslation } from "react-i18next";
import { formatDateTime } from "../../utils/tools/formatDateTime";
import { apiDashboard } from "../../Services/api/Dashboar";
import Cookies from "js-cookie";
import manzil from "../../constants/mahallas.json";
import { Delete, DeleteIcon, Trash, Trash2, X ,User, Phone, Shield, Activity, User2, PhoneCall, ActivityIcon, ActivitySquare, Briefcase, ShieldCheck, ToggleRight, Locate, LocateFixedIcon, Flag, FlagTriangleRight, ChevronLeft } from "lucide-react";
import { toastService } from "../../utils/toast";

export default function JekMalumoti() {
  const { id } = useParams();
  const { t } = useTranslation();
  const tuman = manzil.uz.addresses;
  const mahala = manzil.uz.mahallas;

  //UI states
  const [loading, setLoading] = useState(false);
  const [param, setParam] = useState({});
  const [deleteAdd, setDeleteAdd] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [statData, setStatData] = useState(null);
  const navigate = useNavigate();

  const [profil, setProfil] = useState({
    first_name: "",
    last_name: "",
    phoneNumber: "",
  });
  const [parol, setParol] = useState({
    password: "",
    passwordConfirm: "",
  });
  const [mahalla, setMahalla] = useState({
    district: "",
    neighborhood: "",
  });

  const [nextActiveValue, setNextActiveValue] = useState(null);

  const role = Cookies.get("role");
  const notAllowed = ["INSPECTION"].includes(param?.role);

  const [activePanel, setActivePanel] = useState(null);

  // Modal panel states
  const profilModal = useDisclosure();
  const parolModal = useDisclosure();
  const mahallaModal = useDisclosure();
  const confirmModal = useDisclosure();
  const confDel = useDisclosure();

  //Functional
  const getJEK = async () => {
    try {
      setLoading(true);
      const res = await apiJekData.getById(id);
      setParam(res.data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getJEK();
  }, []);
  useEffect(() => {
    if (param) {
      setProfil({
        first_name: param.first_name || "",
        last_name: param.last_name || "",
        phoneNumber: param.phoneNumber || "",
      });
    }
  }, [param]);

  const getStatistics = async () => {
    try {
      const res = await apiDashboard.DataGet(2026, null, id, null);
      setStatData(res.data);
    } catch (e) {
      console.log(e.response?.data);
    }
  };

  useEffect(() => {
    if (id) {
      getStatistics();
    }
  }, [id]);

  const delAddress = async () => {
    if (!deleteAdd) return;

    try {
      setSaving(true);

    const res =  await apiJekData.delete(deleteAdd.jekId, deleteAdd.addressId);
         toastService.success(res.data?.message || "Manzil muvaffaqiyatli o'chirildi");

      confDel.onClose();
      setDeleteAdd(null);
   
      getJEK();
    
    }  finally {
      setSaving(false);
    }
  };

  const statusMap = React.useMemo(() => {
    const arr = statData?.statuses ?? [];
    return arr.reduce((acc, s) => {
      acc[s.status] = s?._count?.id ?? 0;
      return acc;
    }, {});
  }, [statData]);

  const totalCount = statData?.totalRequests ?? 0;
  const completedCount =
    (statusMap.COMPLETED ?? 0) + (statusMap.JEK_COMPLETED ?? 0);
  const inProgressCount = statusMap.IN_PROGRESS ?? 0;
  const rejectedCount = statusMap.REJECTED ?? 0;

  const cardBg = useColorModeValue("#ffffff", "#0B1C26");
  const cardGradient = useColorModeValue(
    "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
    "linear-gradient(180deg, #0B1C26 0%, #07141e 100%)",
  );
  const cardBorder = useColorModeValue(
    "1px solid rgba(0,0,0,0.06)",
    "1px solid rgba(255,255,255,0.06)",
  );
  const cardShadow = useColorModeValue(
    "0 10px 25px rgba(0,0,0,0.06)",
    "0 18px 55px rgba(0,0,0,0.45)",
  );
  const cardShadowHover = useColorModeValue(
    "0 14px 32px rgba(0,0,0,0.10)",
    "0 24px 70px rgba(0,0,0,0.55)",
  );

  const adLenght = param?.addresses?.length;

  const changeProfil = (e) => {
    const { name, value } = e.target;
    setProfil((prev) => ({ ...prev, [name]: value }));
  };
  const changeParol = (e) => {
    const { name, value } = e.target;
    setParol((prev) => ({ ...prev, [name]: value }));
  };
  const changeMahalla = (e) => {
    const { name, value } = e.target;
    setMahalla((prev) => ({ ...prev, [name]: value }));
  };

  function formatPhone(phone) {
    if (!phone) return "";
    const digits = phone.replace(/\D/g, "");
    if (digits.length !== 12) return phone;
    return `+${digits.slice(0, 3)} ${digits.slice(3, 5)}-${digits.slice(5, 8)}-${digits.slice(8, 10)}-${digits.slice(10, 12)}`;
  }

  const openConfirm = (param, value) => {
    setNextActiveValue(value);
    confirmModal.onOpen();
  };

  const deActivate = async (param) => {
    if (!param?.id) return;
    const payload = { isActive: param?.isActive ? false : true };
    try {
      setSaving(true);
      await apiJekData.deActivation(param.id, payload);
      confirmModal.onClose();
      getJEK();
    } finally {
      setSaving(false);
    }
  };

  const profilChange = async () => {
    try {
      setSaving(true);
      await apiJekData.profil(
        id,
        profil.first_name,
        profil.last_name,
        profil.phoneNumber,
      );
      profilModal.onClose();
      getJEK();
    } finally {
      setSaving(false);
    }
  };
  const parolChange = async () => {
    try {
      setSaving(true);
      await apiJekData.parol(id, parol.password, parol.passwordConfirm);
      parolModal.onClose();
      getJEK();
      setParol({ password: "", passwordConfirm: "" });
      setActivePanel(null);
    } finally {
      setSaving(false);
    }
  };
  const mahallaChange = async () => {
    try {
      setSaving(true);
      await apiJekData.mahalla(id, mahalla.district, mahalla.neighborhood);
      mahallaModal.onClose();
      getJEK();
      setMahalla({ district: "", neighborhood: "" });
      setActivePanel(null);
    } finally {
      setSaving(false);
    }
  };

   const borderColor = useColorModeValue("gray.100", "gray.700");
  const iconColor = useColorModeValue("#5a6e8a", "#a0b4d0");
  const labelColor = useColorModeValue("#5a6e8a", "#a0b4d0");
  const valueColor = useColorModeValue("#1a2c3e", "#e2e8f0");
  return (
    <div>
                  <Box mt={5}>
                <IconButton
                    w={'70px'}
                    bg={cardBg}
                    border={cardBorder}
                    borderRadius="20px"
                    icon={<ChevronLeft />}
                    boxShadow={cardShadow}
                    _hover={{
                        transform: "translateY(-3px)",
                        boxShadow: cardShadowHover,
                    }}
                    backgroundImage={cardGradient}
                    transition="0.2s"
                    onClick={() => navigate(-1)}
                />
            </Box>
      {loading ? (
        <Skeleton rounded={"24px"} mt={5} w={"100%"} h={"400px"} />
      ) : (
        <Flex
          bg={cardBg}
   
          border={cardBorder}
          borderRadius="28px"
          px={{ base: 4, md: 8 }}
          py={{ base: 6, md: 8 }}
          my={5}
          w={"100%"}
          boxShadow={cardShadow}
          transition="all 0.3s cubic-bezier(0.2, 0, 0, 1)"
          _hover={{
            transform: "translateY(-4px)",
            boxShadow: cardShadowHover,
          }}
          direction={"column"}
          mb={4}
          position="relative"
          overflow="hidden"
        >
          {/* Dekorativ aksent chiziq */}
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            h="4px"
           
            borderTopRadius="28px"
          />

          {/* Asosiy ma'lumotlar va manzillar - ikki ustunli tartib */}
          <HStack
            align={"stretch"}
            spacing={{ base: 6, lg: 10 }}
            w="100%"
            flexWrap={{ base: "wrap", lg: "nowrap" }}
          >
            {/* Chap ustun - shaxsiy ma'lumotlar */}
            <VStack
              flex="1"
              minW={{ base: "100%", md: "300px" }}
              align={"start"}
              gap={5}
           
             
              borderRadius="20px"
              border={`1px solid ${borderColor}`}
            >
              <Flex justifyContent="space-between" w="100%" alignItems="center">
                <HStack gap={3}>
                  <Box
                    p={2}
                    bg={useColorModeValue("blue.50", "blue.900/30")}
                    borderRadius="14px"
                  >
                    <User size={20} color={iconColor} />
                  </Box>
                  <Text fontWeight="600" color={labelColor}>
                    {t("jekEmployees.employee")}:
                  </Text>
                  <Text fontWeight="700" color={valueColor}>
                    {param?.first_name} {param?.last_name}
                  </Text>
                </HStack>
              </Flex>

              <HStack gap={3}>
                <Box p={2} bg={useColorModeValue("green.50", "green.900/30")} borderRadius="14px">
                  <Phone size={20} color={iconColor} />
                </Box>
                <Text fontWeight="600" color={labelColor}>
                  {t("jekEmployees.phone")}:
                </Text>
                <Text fontWeight="700" color={valueColor}>
                  {formatPhone(param?.phoneNumber)}
                </Text>
              </HStack>

              <HStack gap={3}>
                <Box p={2} bg={useColorModeValue("purple.50", "purple.900/30")} borderRadius="14px">
                  <Briefcase size={20} color={iconColor} />
                </Box>
                <Text fontWeight="600" color={labelColor}>
                  {t("common.role")}:
                </Text>
                <Text fontWeight="700" color={valueColor}>
                  {param?.role}
                </Text>
              </HStack>

              <HStack gap={3}>
                <Box p={2} bg={useColorModeValue("teal.50", "teal.900/30")} borderRadius="14px">
                  <ShieldCheck size={20} color={iconColor} />
                </Box>
                <Text fontWeight="600" color={labelColor}>
                  {t("common.status")}:
                </Text>
                <Badge
                  colorScheme={param?.isActive ? "green" : "red"}
                  fontSize="0.8rem"
                  px={3}
                  py={1}
                  borderRadius="full"
                >
                  {param?.isActive
                    ? t("jekEmployees.statusActive")
                    : t("jekEmployees.statusInactive")}
                </Badge>
              </HStack>

              {!notAllowed && (
                <HStack gap={3}>
                  <Box p={2} bg={useColorModeValue("orange.50", "orange.900/30")} borderRadius="14px">
                    <ToggleRight size={20} color={iconColor} />
                  </Box>
                  <Text fontWeight="600" color={labelColor}>
                    {t("jekEmployees.toggle")}
                  </Text>
                  <Switch
                    isChecked={!!param?.isActive}
                    onChange={(e) => openConfirm(param, e.target.checked)}
                    size="md"
                    colorScheme="green"
                  />
                </HStack>
              )}
            </VStack>

            {/* O'ng ustun - manzillar */}
            <VStack alignItems={"start"} flex="2" minW={{ base: "100%", md: "350px" }} gap={3}>
              {!notAllowed && (
                <HStack gap={2} mb={1}>
                  <Box
                    p={1.5}
                    bg={useColorModeValue("gray.100", "gray.700")}
                    borderRadius="10px"
                  >
                   
                  </Box>
                  <Text fontWeight="bold" color={labelColor} fontSize="sm">
                    {adLenght === 1
                      ? t("jekEmployees.addressSingle")
                      : t("jekEmployees.addressPlural")}
                  </Text>
                  <Badge borderRadius="full" px={2} colorScheme="blue">
                    {adLenght}
                  </Badge>
                </HStack>
              )}

              <Box
                w={"100%"}
                maxH={"280px"}
              
                sx={{
                  "&::-webkit-scrollbar": {
                    width: "6px",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: useColorModeValue("gray.100", "gray.700"),
                    borderRadius: "10px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: useColorModeValue("gray.400", "gray.500"),
                    borderRadius: "10px",
                  },
                }}
              >
                <VStack gap={2} w="100%">
                  {param?.addresses?.map((item) => (
                    <Box
                      key={item.address.id}
                      w="100%"
                      p={3}
                      bg={"bg"}
                      borderRadius="14px"
                      border={`1px solid ${borderColor}`}
                      transition="0.2s"
                      _hover={{
                        borderColor: useColorModeValue("blue.200", "blue.600"),
             
                      }}
                    >
                      <Flex justifyContent={"space-between"} alignItems="center">
                        <HStack spacing={2}>
                          <Box
                            w="8px"
                            h="8px"
                            borderRadius="full"
                            bg="green.400"
                          />
                          <Text fontWeight="500" fontSize="sm" color={valueColor}>
                            {item.address.district}, {item.address.neighborhood}
                          </Text>
                        </HStack>
                        <Tooltip  placement="top">
                          <IconButton
                            icon={<Trash2 size={16} />}
                            colorScheme="red"
                            variant="ghost"
                            size="sm"
                            aria-label="delete"
                            onClick={() => {
                              setDeleteAdd({
                                addressId: item.address.id,
                                jekId: param.id,
                              });
                              confDel.onOpen();
                            }}
                          />
                        </Tooltip>
                      </Flex>
                    </Box>
                  ))}
                </VStack>
              </Box>
            </VStack>

            {/* O'ng tomondagi tugmalar paneli */}
            {!notAllowed && (
              <VStack
                align={{ base: "stretch", lg: "end" }}
                spacing={4}
                minW={{ base: "100%", lg: "240px" }}
              >
                <Button
                  w="100%"
                  rounded="16px"
                  onClick={profilModal.onOpen}
                  bgGradient="linear(135deg, #2b6cb0, #2c5282)"
                  color="white"
                  _hover={{
                    bgGradient: "linear(135deg, #2c5282, #2b6cb0)",
                    transform: "scale(1.02)",
                  }}
                  transition="0.2s"
                  size="md"
                  leftIcon={<User size={18} />}
                >
                  {t("jekEmployees.editProfile")}
                </Button>
                <Button
                  w="100%"
                  rounded="16px"
                  onClick={parolModal.onOpen}
                  variant="outline"
                  colorScheme="orange"
                  borderWidth="2px"
                  _hover={{ transform: "scale(1.02)" }}
                  transition="0.2s"
                  leftIcon={<ShieldCheck size={18} />}
                >
                  {t("jekEmployees.editProfile")}
                </Button>
                <Button
                  w="100%"
                  rounded="16px"
                  onClick={mahallaModal.onOpen}
                  bgGradient="linear(135deg, #2c7a4d, #276749)"
                  color="white"
                  _hover={{
                    bgGradient: "linear(135deg, #276749, #2c7a4d)",
                    transform: "scale(1.02)",
                  }}
                  transition="0.2s"
                  leftIcon={<Text><FlagTriangleRight /></Text>}
                >
                  {t("jekEmployees.addAddress")}
                </Button>
              </VStack>
            )}
          </HStack>

          {/* Statistikalar - to'rtta karta */}
          {!notAllowed && (
            <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={5} mt={8}>
              {/* JAMI */}
              <Box
                p={5}
                borderRadius="20px"
                bg={useColorModeValue("white", "gray.800")}
                border={`1px solid gray`}
                boxShadow="sm"
                transition="0.2s"
                _hover={{
                  transform: "translateY(-4px)",
                  boxShadow: "md",
                  borderColor: useColorModeValue("blue.200", "blue.600"),
                }}
              >
                <Text fontSize="11px" fontWeight="600" textTransform="uppercase" letterSpacing="0.5px" color="gray.400" mb={2}>
                   {t("dashboard.totalAppeals")}
                </Text>
                <Text fontSize="32px" fontWeight="800" color={useColorModeValue("#1a2c3e", "#e2e8f0")}>
                  {totalCount}
                </Text>
              </Box>

              {/* BAJARILGAN */}
              <Box
                p={5}
                borderRadius="20px"
                bg={useColorModeValue("green.50", "rgba(72,187,120,0.12)")}
                border="1px solid"
                borderColor={useColorModeValue("green.200", "rgba(72,187,120,0.3)")}
                boxShadow="sm"
                transition="0.2s"
                _hover={{
                  transform: "translateY(-4px)",
                  boxShadow: "md",
                }}
              >
                <Text fontSize="11px" fontWeight="600" textTransform="uppercase" letterSpacing="0.5px" color="green.500" mb={2}>
                   {t("dashboard.completed")}
                </Text>
                <Text fontSize="32px" fontWeight="800" color="green.500">
                  {completedCount}
                </Text>
              </Box>

              {/* JARAYONDA */}
              <Box
                p={5}
                borderRadius="20px"
                bg={useColorModeValue("yellow.50", "rgba(247,201,72,0.12)")}
                border="1px solid"
                borderColor={useColorModeValue("yellow.300", "rgba(247,201,72,0.3)")}
                boxShadow="sm"
                transition="0.2s"
                _hover={{
                  transform: "translateY(-4px)",
                  boxShadow: "md",
                }}
              >
                <Text fontSize="11px" fontWeight="600" textTransform="uppercase" letterSpacing="0.5px" color="yellow.600" mb={2}>
                   {t("dashboard.inProgress")}
                </Text>
                <Text fontSize="32px" fontWeight="800" color="yellow.600">
                  {inProgressCount}
                </Text>
              </Box>

              {/* RAD ETILGAN */}
              <Box
                p={5}
                borderRadius="20px"
                bg={useColorModeValue("red.50", "rgba(245,101,101,0.12)")}
                border="1px solid"
                borderColor={useColorModeValue("red.200", "rgba(245,101,101,0.3)")}
                boxShadow="sm"
                transition="0.2s"
                _hover={{
                  transform: "translateY(-4px)",
                  boxShadow: "md",
                }}
              >
                <Text fontSize="11px" fontWeight="600" textTransform="uppercase" letterSpacing="0.5px" color="red.500" mb={2}>
                  {t("dashboard.rejected")}
                </Text>
                <Text fontSize="32px" fontWeight="800" color="red.500">
                  {rejectedCount}
                </Text>
              </Box>
            </SimpleGrid>
          )}

          {/* Collapse panel - tahrirlash modalari */}
          {activePanel && <Divider w={"100%"} my={6} borderColor={borderColor} />}
          <Collapse in={!!activePanel} animateOpacity>
            <Flex justify="center" w="100%" mt={4}>
              {activePanel === "profil" && (
                <VStack w={{ base: "100%", md: "460px" }} spacing={5}>
                  <Text fontSize="lg" fontWeight="bold" color={labelColor}>
                    ✏️ {t("jekEmployees.editProfileTitle")}
                  </Text>
                  <Input
                    value={profil.first_name}
                    name="first_name"
                    onChange={changeProfil}
                    rounded={"16px"}
                    placeholder={t("register.firstNamePlaceholder")}
                    size="lg"
                    bg={useColorModeValue("white", "gray.800")}
                  />
                  <Input
                    value={profil.last_name}
                    name="last_name"
                    onChange={changeProfil}
                    rounded={"16px"}
                    placeholder={t("register.lastNamePlaceholder")}
                    size="lg"
                    bg={useColorModeValue("white", "gray.800")}
                  />
                  <Input
                    defaultValue={"+998"}
                    value={profil.phoneNumber}
                    name="phoneNumber"
                    onChange={changeProfil}
                    rounded={"16px"}
                    placeholder={t("register.phonePlaceholder")}
                    size="lg"
                    bg={useColorModeValue("white", "gray.800")}
                  />
                  <Button
                    w={"100%"}
                    variant={"solidPrimary"}
                    rounded={"16px"}
                    onClick={profilChange}
                    isLoading={saving}
                    size="lg"
                  >
                    {t("common.confirm")}
                  </Button>
                </VStack>
              )}
              {activePanel === "parol" && (
                <VStack w={{ base: "100%", md: "460px" }} spacing={5}>
                  <Text fontSize="lg" fontWeight="bold" color={labelColor}>
                    🔒 {t("jekEmployees.changePasswordTitle")}
                  </Text>
                  <InputGroup size="lg">
                    <Input
                      value={parol.password}
                      name="password"
                      onChange={changeParol}
                      rounded={"16px"}
                      placeholder={t("jekEmployees.newPassword")}
                      type={showPassword ? "text" : "password"}
                      bg={useColorModeValue("white", "gray.800")}
                    />
                    <InputRightElement>
                      <IconButton
                        variant="ghost"
                        size="sm"
                        icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label="show password"
                      />
                    </InputRightElement>
                  </InputGroup>
                  <InputGroup size="lg">
                    <Input
                      value={parol.passwordConfirm}
                      name="passwordConfirm"
                      onChange={changeParol}
                      rounded={"16px"}
                      placeholder={t("jekEmployees.confirmNewPassword")}
                      type={showConfirmPassword ? "text" : "password"}
                      bg={useColorModeValue("white", "gray.800")}
                    />
                    <InputRightElement>
                      <IconButton
                        variant="ghost"
                        size="sm"
                        icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label="show confirm password"
                      />
                    </InputRightElement>
                  </InputGroup>
                  <Button
                    w={"100%"}
                    variant={"solidPrimary"}
                    rounded={"16px"}
                    onClick={parolChange}
                    isLoading={saving}
                    size="lg"
                  >
                    {t("common.confirm")}
                  </Button>
                </VStack>
              )}
              {activePanel === "mahalla" && (
                <VStack w={{ base: "100%", md: "460px" }} spacing={5}>
                  <Text fontSize="lg" fontWeight="bold" color={labelColor}>
                    📍 {t("jekEmployees.addAddressTitle")}
                  </Text>
                  <Input
                    value={mahalla.district}
                    name="district"
                    onChange={changeMahalla}
                    rounded={"16px"}
                    placeholder={t("register.districtPlaceholder")}
                    size="lg"
                    bg={useColorModeValue("white", "gray.800")}
                  />
                  <Input
                    value={mahalla.neighborhood}
                    name="neighborhood"
                    onChange={changeMahalla}
                    rounded={"16px"}
                    placeholder={t("register.mahallaPlaceholder")}
                    size="lg"
                    bg={useColorModeValue("white", "gray.800")}
                  />
                  <Button
                    w={"100%"}
                    variant={"solidPrimary"}
                    rounded={"16px"}
                    onClick={mahallaChange}
                    isLoading={saving}
                    size="lg"
                  >
                    {t("common.confirm")}
                  </Button>
                </VStack>
              )}
            </Flex>
          </Collapse>
        </Flex>
      )}

      {/* CONFIRMATION MODAL FOR ACTIVATION/DEACTIVATION */}
      <Modal
        isOpen={confirmModal.isOpen}
        onClose={confirmModal.onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>
            {nextActiveValue
              ? t("jekEmployees.confirmActivateTitle")
              : t("jekEmployees.confirmDeactivateTitle")}
          </ModalHeader>
          <ModalBody>
            <Text>
              {nextActiveValue
                ? t("jekEmployees.confirmActivateText")
                : t("jekEmployees.confirmDeactivateText")}
            </Text>
            <Text mt={3}>
              {t("jekEmployees.employee")}:{" "}
              <b>{param ? `${param?.first_name} ${param?.last_name}` : "-"}</b>
            </Text>
          </ModalBody>
          <ModalFooter gap={3}>
            <Button onClick={confirmModal.onClose}>{t("common.cancel")}</Button>
            <Button
              onClick={() => deActivate(param)}
              colorScheme="blue"
              isLoading={saving}
            >
              {t("common.confirm")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* CONFIRMATION MODAL FOR ADDRESS DELETION */}
      <Modal isOpen={confDel.isOpen} onClose={confDel.onClose} isCentered>
        <ModalOverlay />
        <ModalContent borderRadius={"16px"}>
          <ModalHeader>Rostdan xam biriktirilgan manzilni ochirmoqchimsz ?</ModalHeader>
      
          <ModalFooter gap={3}>
            <Button onClick={confDel.onClose}>Bekor qilish</Button>
            <Button onClick={delAddress} isLoading={saving} colorScheme="red">
              Xa
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* PROFILE EDIT PANEL */}
      <Modal
        isOpen={profilModal.isOpen}
        onClose={() => {
          profilModal.onClose();
          setActivePanel(null);
        }}
        isCentered
      >
        <ModalOverlay />
        <ModalContent borderRadius={"16px"}>
          <ModalCloseButton />
          <ModalHeader>{t("jekEmployees.editProfile")}</ModalHeader>
          <ModalBody>
            <VStack w="100%" spacing={4}>
              <Input
                value={profil.first_name}
                name="first_name"
                onChange={changeProfil}
                rounded={"16px"}
                placeholder={t("register.firstNamePlaceholder")}
              />
              <Input
                value={profil.last_name}
                name="last_name"
                onChange={changeProfil}
                rounded={"16px"}
                placeholder={t("register.lastNamePlaceholder")}
              />
              <Input
                defaultValue={"+998"}
                value={profil.phoneNumber}
                name="phoneNumber"
                onChange={changeProfil}
                rounded={"16px"}
                placeholder={t("register.phonePlaceholder")}
              />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={() => {
                profilModal.onClose();
                setActivePanel(null);
              }}
              mr={3}
            >
              {t("common.cancel")}
            </Button>
            <Button
              onClick={profilChange}
              colorScheme="blue"
              isLoading={saving}
            >
              {t("common.confirm")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* PASSWORD EDIT PANEL */}
      <Modal
        isOpen={parolModal.isOpen}
        onClose={() => {
          parolModal.onClose();
          setActivePanel(null);
        }}
        isCentered
      >
        <ModalOverlay />
        <ModalContent borderRadius={"16px"}>
          <ModalCloseButton />
          <ModalHeader>{t("jekEmployees.changePasswordTitle")}</ModalHeader>
          <ModalBody>
            <VStack w="100%" spacing={4}>
              <InputGroup>
                <Input
                  value={parol.password}
                  name="password"
                  onChange={changeParol}
                  rounded={"16px"}
                  placeholder={t("jekEmployees.newPassword")}
                  type={showPassword ? "text" : "password"}
                />
                <InputRightElement>
                  <IconButton
                    variant="ghost"
                    size="sm"
                    icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    onClick={() => setShowPassword(!showPassword)}
                  />
                </InputRightElement>
              </InputGroup>

              <InputGroup>
                <Input
                  value={parol.passwordConfirm}
                  name="passwordConfirm"
                  onChange={changeParol}
                  rounded={"16px"}
                  placeholder={t("jekEmployees.confirmNewPassword")}
                  type={showConfirmPassword ? "text" : "password"}
                />
                <InputRightElement>
                  <IconButton
                    variant="ghost"
                    size="sm"
                    icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                </InputRightElement>
              </InputGroup>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={() => {
                parolModal.onClose();
                setActivePanel(null);
              }}
              mr={3}
            >
              {t("common.cancel")}
            </Button>
            <Button onClick={parolChange} colorScheme="blue" isLoading={saving}>
              {t("common.confirm")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* MAHALLA EDIT PANEL */}
      <Modal
        isOpen={mahallaModal.isOpen}
        onClose={() => {
          mahallaModal.onClose();
          setActivePanel(null);
        }}
        isCentered
      >
        <ModalOverlay />
        <ModalContent borderRadius={"16px"}>
          <ModalCloseButton />
          <ModalHeader>{t("jekEmployees.addAddressTitle")}</ModalHeader>
          <ModalBody>
            <VStack w="100%" spacing={4}>
              <Select
                placeholder={t("register.districtPlaceholder")}
                name="district"
                value={mahalla.district}
                onChange={changeMahalla}
                rounded={"16px"}
              >
                {Object.keys(tuman).map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </Select>
              <Select
                placeholder={t("register.mahallaPlaceholder")}
                name="neighborhood"
                value={mahalla.neighborhood}
                onChange={changeMahalla}
                rounded={"16px"}
                isDisabled={!mahalla.district}
              >
                {mahalla.district &&
                  Object.keys(mahala[mahalla.district] || {}).map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
              </Select>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={() => {
                mahallaModal.onClose();
                setActivePanel(null);
              }}
              mr={3}
            >
              {t("common.cancel")}
            </Button>
            <Button
              onClick={mahallaChange}
              colorScheme="blue"
              isLoading={saving}
            >
              {t("common.confirm")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
