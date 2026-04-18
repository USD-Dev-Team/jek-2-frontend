import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";

import LOGO from "/jek.png";
import adress from "../../constants/mahallas.json";

import { useMemo, useRef, useState } from "react";
import { Eye, EyeClosed, Globe } from "lucide-react";
import { useNavigate } from "react-router";
import { toastService } from "../../utils/toast";
import { Auth } from "../../Services/api/Auth";
import { useTranslation } from "react-i18next";

export default function Register() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  // UI refs
  const ismInput = useRef("");
  const familiyaInput = useRef("");
  const telInput = useRef("");
  const parolInput = useRef("");
  const confirmInput = useRef("");

  const [loading, setLoading] = useState(false);

  const [selectedTuman, setSelectedTuman] = useState("");     // value = uz key
  const [selectedMahalla, setSelectedMahalla] = useState(""); // value = mahalla key (odatda uz)

  // Address list language-based (fallback uz)
  const lang = i18n.language || "uz";
  const addressData = adress?.[lang] ?? adress?.uz;

  // JSON: addresses va mahallas object
  const tuman = addressData?.addresses ?? {};
  const mahalla = addressData?.mahallas ?? {};

  // RU/EN muammo: mahallas keylari district tarjimasi bo'lib qolgan
  const mahallaObj = useMemo(() => {
    if (!selectedTuman) return {};
    const districtKeyUz = selectedTuman;              // masalan: "Boyovut tumani"
    const districtLabelTranslated = tuman?.[districtKeyUz]; // ru/en: "Боевутский район" / "Boyovut district"
    return mahalla?.[districtKeyUz] || mahalla?.[districtLabelTranslated] || {};
  }, [selectedTuman, mahalla, tuman]);

  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);

  const [errors, setErrors] = useState({
    ism: "",
    familiya: "",
    tuman: "",
    mahalla: "",
    telefon: "",
    parol: "",
    confirmParol: "",
  });

  const clearError = (field) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const ismText = ismInput.current.value.trim();
    const familiyaText = familiyaInput.current.value.trim();
    const telText = telInput.current.value.trim();
    const parolText = parolInput.current.value.trim();
    const confirmText = confirmInput.current.value.trim();

    let newErrors = {};

    // Ism validation
    if (!ismText) newErrors.ism = t("register.errors.firstNameRequired");
    else if (ismText.length < 2) newErrors.ism = t("register.errors.firstNameShort");
    else if (ismText.length > 50) newErrors.ism = t("register.errors.firstNameLong");

    // Familiya validation
    if (!familiyaText) newErrors.familiya = t("register.errors.lastNameRequired");
    else if (familiyaText.length < 2) newErrors.familiya = t("register.errors.lastNameShort");
    else if (familiyaText.length > 50) newErrors.familiya = t("register.errors.lastNameLong");

    // Tel validation
    if (!telText) newErrors.telefon = t("register.errors.phoneRequired");
    else if (!telText.startsWith("+998")) newErrors.telefon = t("register.errors.phoneStart");
    else if (telText.length !== 13) newErrors.telefon = t("register.errors.phoneLength");

    // Address validation
    if (!selectedTuman) newErrors.tuman = t("register.errors.districtRequired");
    if (selectedTuman && !selectedMahalla) newErrors.mahalla = t("register.errors.mahallaRequired");

    // Password validation
    if (!parolText) newErrors.parol = t("register.errors.passwordRequired");
    else if (parolText.length < 8) newErrors.parol = t("register.errors.passwordMin");
    else if (!/^(?=.*[a-z])(?=.*[A-Z]).+$/.test(parolText))
      newErrors.parol = t("register.errors.passwordCase");

    // Confirm password validation
    if (!confirmText) newErrors.confirmParol = t("register.errors.confirmRequired");
    else if (parolText !== confirmText) newErrors.confirmParol = t("register.errors.confirmMatch");

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const payload = {
        first_name: ismInput.current.value,
        last_name: familiyaInput.current.value,
        phoneNumber: telInput.current.value,

        // Backendga stabil qiymat yuborish uchun: district = selectedTuman (uz key)
        addresses: [{ district: selectedTuman, neighborhood: selectedMahalla }],

        password: parolInput.current.value,
        passwordConfirm: confirmInput.current.value,
      };

      setLoading(true);
      const res = await Auth.Register(payload);

      if (res.status === 200 || res.status === 201) {
        navigate("/login");
      } else {
        toastService.error(res?.data?.message || "ok");
      }
    } catch (err) {
      toastService.error(
        err?.response?.data?.message || t("register.systemError") || "Tizim xatosi"
      );
    } finally {
      setLoading(false);
    }
  };

  // language label
  const langMap = { uz: "O'z", en: "En", ru: "Ru" };
  const langLabel = langMap[i18n.language] ?? (i18n.language || "").toUpperCase();

  return (
    <Flex minH="100vh" align="center" justify="center" bg="bg" px={4} my={10}>
      <Box
        as="form"
        onSubmit={handleSubmit}
        w={{ base: "100%", sm: "400px" }}
        bg="surface"
        p={8}
        rounded="xl"
        shadow="lg"
      >
        {/* Language menu */}
        <Flex justify="flex-end" mb={4}>
          <Menu>
            <MenuButton
              as={Button}
              leftIcon={<Globe size={18} />}
              size="sm"
              variant="outline"
              colorScheme="blue"
              fontWeight="600"
            >
              {t("login.language")} — {langLabel}
            </MenuButton>
            <MenuList minW="140px">
              <MenuItem onClick={() => i18n.changeLanguage("uz")}>🇺🇿 O'zbekcha</MenuItem>
              <MenuItem onClick={() => i18n.changeLanguage("en")}>🇬🇧 English</MenuItem>
              <MenuItem onClick={() => i18n.changeLanguage("ru")}>🇷🇺 Русский</MenuItem>
            </MenuList>
          </Menu>
        </Flex>

        {/* Logo */}
        <Flex justify="center" mb={4}>
          <Box
            w="60px"
            h="60px"
            bg="blue.900"
            rounded="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
            color="white"
            fontWeight="bold"
            fontSize="md"
          >
            <Image rounded="100%" src={LOGO} alt="" />
          </Box>
        </Flex>

        {/* Title */}
        <Heading textAlign="center" size="lg" mb={2} color="text">
          {t("register.title")}
        </Heading>

        {/* Subtitle */}
        <Text textAlign="center" color="gray.500" mb={6}>
          {t("register.subtitle")}
        </Text>

        {/* Ism Familiya */}
        <HStack>
          <FormControl mb={4} isInvalid={!!errors.ism}>
            <FormLabel color="text">
              {t("register.firstName")} <span style={{ color: "red" }}>*</span>
            </FormLabel>
            <Input
              ref={ismInput}
              placeholder={t("register.firstNamePlaceholder")}
              onChange={() => clearError("ism")}
            />
            <FormErrorMessage>{errors.ism}</FormErrorMessage>
          </FormControl>

          <FormControl mb={4} isInvalid={!!errors.familiya}>
            <FormLabel color="text">
              {t("register.lastName")} <span style={{ color: "red" }}>*</span>
            </FormLabel>
            <Input
              ref={familiyaInput}
              placeholder={t("register.lastNamePlaceholder")}
              onChange={() => clearError("familiya")}
            />
            <FormErrorMessage>{errors.familiya}</FormErrorMessage>
          </FormControl>
        </HStack>

        {/* Telefon */}
        <FormControl mb={4} isInvalid={!!errors.telefon}>
          <FormLabel color="text">
            {t("register.phone")} <span style={{ color: "red" }}>*</span>
          </FormLabel>
          <Input
            ref={telInput}
            type="tel"
            placeholder={t("register.phonePlaceholder")}
            onChange={() => clearError("telefon")}
          />
          <FormErrorMessage>{errors.telefon}</FormErrorMessage>
        </FormControl>

        {/* Address */}
        <HStack>
          <FormControl mb={4} isInvalid={!!errors.tuman}>
            <FormLabel color="text">
              {t("register.district")} <span style={{ color: "red" }}>*</span>
            </FormLabel>
            <Select
              value={selectedTuman}
              placeholder={t("register.districtPlaceholder")}
              onChange={(e) => {
                setSelectedTuman(e.target.value);
                setSelectedMahalla(""); // tuman o'zgarsa mahalla reset
                clearError("tuman");
                clearError("mahalla");
              }}
            >
              {Object.entries(tuman).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </Select>
            <FormErrorMessage>{errors.tuman}</FormErrorMessage>
          </FormControl>

          <FormControl mb={4} isInvalid={!!errors.mahalla} isDisabled={!selectedTuman}>
            <FormLabel color="text">
              {t("register.mahalla")} <span style={{ color: "red" }}>*</span>
            </FormLabel>
            <Select
              value={selectedMahalla}
              placeholder={t("register.mahallaPlaceholder")}
              onChange={(e) => {
                setSelectedMahalla(e.target.value);
                clearError("mahalla");
              }}
            >
              {Object.entries(mahallaObj).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </Select>
            <FormErrorMessage>{errors.mahalla}</FormErrorMessage>
          </FormControl>
        </HStack>

        {/* Parol */}
        <FormControl mb={2} isInvalid={!!errors.parol}>
          <FormLabel color="text">
            {t("register.password")} <span style={{ color: "red" }}>*</span>
          </FormLabel>
          <InputGroup>
            <Input
              ref={parolInput}
              type={show ? "text" : "password"}
              placeholder={t("register.passwordPlaceholder")}
              onChange={() => clearError("parol")}
            />
            <InputRightElement cursor="pointer" onClick={() => setShow(!show)}>
              {show ? <Eye /> : <EyeClosed />}
            </InputRightElement>
          </InputGroup>
          <FormErrorMessage>{errors.parol}</FormErrorMessage>
        </FormControl>

        {/* Confirm */}
        <FormControl mb={5} isInvalid={!!errors.confirmParol}>
          <FormLabel color="text">
            {t("register.confirmPassword")} <span style={{ color: "red" }}>*</span>
          </FormLabel>
          <InputGroup>
            <Input
              ref={confirmInput}
              type={show2 ? "text" : "password"}
              placeholder={t("register.confirmPasswordPlaceholder")}
              onChange={() => clearError("confirmParol")}
            />
            <InputRightElement cursor="pointer" onClick={() => setShow2(!show2)}>
              {show2 ? <Eye /> : <EyeClosed />}
            </InputRightElement>
          </InputGroup>
          <FormErrorMessage>{errors.confirmParol}</FormErrorMessage>
        </FormControl>

        {/* Buttons */}
        <HStack>
          <Button
            type="submit"
            style={{ cursor: loading ? "progress" : "pointer" }}
            w="100%"
            isLoading={loading}
            _hover={{ bg: "secondary" }}
            loadingText={t("login.loading")}
            variant="solidPrimary"
          >
            {t("register.createBtn")}
          </Button>
        </HStack>
      </Box>
    </Flex>
  );
}