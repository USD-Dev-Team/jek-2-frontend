import {
    Box,
    Flex,
    Heading,
    Text,
    Input,
    Button,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Image,
    InputGroup,
    InputRightElement,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
} from "@chakra-ui/react";
import LOGO from "/jek.png";
import { useRef, useState } from "react";
import { Auth } from "../../Services/api/Auth";
import { useAuth } from "../../hooks/useAuth";
import { toastService } from "../../utils/toast";
import { useNavigate } from "react-router";
import { Eye, EyeClosed, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

export default function Login() {
    const { t, i18n } = useTranslation();
    const { login } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);

    const passInput = useRef("");
    const logInput = useRef("");

    const [errors, setErrors] = useState({ login: "", password: "" });

    const MIN_PASSWORD = 8;

    const clearError = (field) => {
        setErrors((prev) => ({ ...prev, [field]: "" }));
    };

    const handleLangChange = (lng) => {
        i18n.changeLanguage(lng);
        localStorage.setItem("lng", lng);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const loginText = String(logInput.current.value || "").trim();
        const password = String(passInput.current.value || "").trim();

        const newErrors = {};

        if (!loginText) {
            newErrors.login = t("login.errors.loginRequired");
        }

        if (!password) {
            newErrors.password = t("login.errors.passwordRequired");
        } else if (password.length < MIN_PASSWORD) {
            newErrors.password = t("login.errors.passwordMin", { min: MIN_PASSWORD });
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        try {
            setLoading(true);

            const payload = {
                phoneNumber: logInput.current.value,
                password: passInput.current.value,
            };

            const res = await Auth.Login(payload);

            if (res.status === 200 || res.status === 201) {
                const data = res.data;

                login({
                    token: data.accessToken,
                    refreshToken: data.refreshToken,
                    userId: data?.userId,
                    role: data?.role,
                    first_name: data?.first_name,
                    last_name: data?.last_name,
                    district: data?.addresses?.[0]?.district || "",
                    neighborhood: data?.addresses?.[0]?.neighborhood || "",
                });

                if (data.role === "JEK") {
                    navigate("/jek/Dashboard");
                    toastService.success(t("login.toasts.success"));
                } else if (data.role === "GOVERNMENT") {
                    navigate("/government/Dashboard");
                    toastService.success(t("login.toasts.welcomeBoss"));
                } else if (data.role === "INSPECTION") {
                    navigate("/inspection/Dashboard");
                    toastService.success(t("login.toasts.success"));
                } else {
                    toastService.error(t("login.toasts.roleMismatch"));
                }
            } else {
                toastService.error(res?.data?.message || t("login.toasts.systemError"));
            }
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                err?.data?.message ||
                t("login.toasts.systemError");
            toastService.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const langShort = t(`languages.short.${i18n.language}`, {
        defaultValue: (i18n.language || "uz").toUpperCase(),
    });

    return (
        <Flex minH="100vh" align="center" justify="center" bg="bg" px={4}>
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
                <Flex justify="flex-end" mb={6}>
                    <Menu>
                        <MenuButton
                            as={Button}
                            leftIcon={<Globe size={18} />}
                            size="sm"
                            variant="outline"
                            colorScheme="blue"
                            fontWeight="600"
                        >
                            {t("login.language")} — {langShort}
                        </MenuButton>

                        <MenuList minW="140px">
                            <MenuItem onClick={() => handleLangChange("uz")}>
                                {t("languages.uz")}
                            </MenuItem>
                            <MenuItem onClick={() => handleLangChange("en")}>
                                {t("languages.en")}
                            </MenuItem>
                            <MenuItem onClick={() => handleLangChange("ru")}>
                                {t("languages.ru")}
                            </MenuItem>
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
                    >
                        <Image rounded="full" src={LOGO} alt="logo" />
                    </Box>
                </Flex>

                <Heading textAlign="center" size="lg" mb={2} color="text">
                    {t("login.title")}
                </Heading>

                <Text textAlign="center" color="gray.500" mb={6}>
                    {t("login.subtitle")}
                </Text>

                {/* Login */}
                <FormControl mb={4} isInvalid={!!errors.login}>
                    <FormLabel color="text">{t("login.login")}</FormLabel>
                    <Input
                        ref={logInput}
                        placeholder={t("login.placeholders.phone")}
                        onChange={() => clearError("login")}
                    />
                    <FormErrorMessage>{errors.login}</FormErrorMessage>
                </FormControl>

                {/* Password */}
                <FormControl mb={2} isInvalid={!!errors.password}>
                    <FormLabel color="text">{t("login.password")}</FormLabel>
                    <InputGroup>
                        <Input
                            ref={passInput}
                            type={show ? "text" : "password"}
                            placeholder={t("login.placeholders.password")}
                            onChange={() => clearError("password")}
                        />
                        <InputRightElement
                            cursor="pointer"
                            onClick={() => setShow(!show)}
                        >
                            {show ? <Eye /> : <EyeClosed />}
                        </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage>{errors.password}</FormErrorMessage>
                </FormControl>

                {/* Register link */}
                <Flex justifyContent="end" mb={5}>
                    <NavLink
                        style={{ color: "#4fc7ff", textDecoration: "underline" }}
                        to="/register"
                    >
                        {t("login.noAccount")}
                    </NavLink>
                </Flex>

                {/* Submit */}
                <Button
                    type="submit"
                    w="100%"
                    isLoading={loading}
                    loadingText={t("common.loading")}
                    variant="solidPrimary"
                >
                    {t("login.button")}
                </Button>
            </Box>
        </Flex>
    );
}