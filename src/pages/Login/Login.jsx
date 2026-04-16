import {
    Box,
    Flex,
    Heading,
    Text,
    Input,
    Button,
    useColorMode,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Link,
    Img,
    Image,
    InputGroup,
    InputRightElement,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
} from "@chakra-ui/react";
import LOGO from '/jek.png'
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
    // UI states
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);

    //pass for login and register 
    const passInput = useRef("");
    const logInput = useRef("");

    const [errors, setErrors] = useState({ login: "", password: "" });

    // ❗️ Input o'zgarsa error avtomatik tozalanadi
    const clearError = (field) => {
        setErrors((prev) => ({ ...prev, [field]: "" }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const loginText = logInput.current.value.trim();
        const password = passInput.current.value.trim();

        let newErrors = {};

        // Login validation
        if (!loginText) {
            newErrors.login = "Login kiritilmadi";
        }

        // Password validation
        if (!password) {
            newErrors.password = "Parol kiritilmadi";
        } else if (password.length < 6) {
            newErrors.password = "Parol kamida 8 belgidan iborat bo'lishi kerak";
        }
        // else if (!/^(?=.*[a-z])(?=.*[A-Z]).+$/.test(password)) {
        //     newErrors.password = 'Parolda katta va kichik harf bo‘lishi shart'
        // }

        setErrors(newErrors);

        // Agar hatolik bo'lsa API chaqirilmaydi
        if (Object.keys(newErrors).length > 0) return;

        try {
            const payload = {
                phoneNumber: logInput.current.value,
                password: passInput.current.value,
            };
            setLoading(true);
            const res = await Auth.Login(payload);
            console.log(res);
            if (res.status == 200 || res.status == 201) {
                const data = res.data;
                login({
                    token: data.accessToken,
                    refreshToken: data.refreshToken,
                    userId: data?.userId,
                    role: data?.role,
                    first_name: data?.first_name,
                    last_name: data?.last_name,
                    district: data?.addresses?.[0]?.district || '',
                    neighborhood: data?.addresses?.[0]?.neighborhood || ''
                });
                if (data.role === "JEK") {
                    navigate("/jek/Dashboard")
                    toastService.success("Muvaffaqiyatli");
                } else if (data.role === "GOVERNMENT") {
                    navigate("/government/Dashboard");
                    toastService.success("Muvaffaqiyatli, Hush kelibsiz Boss !")
                } else if (data.role === "INSPECTION") {
                    navigate('/inspection/Dashboard');
                    toastService.success("Successfully")
                }
                else {
                    toastService.error("Role mos kelmadi")
                }
            } else {
                toastService.error(res?.data?.message || "ok");
            }
        } catch (err) {
            console.log(err);

            if (err) {
                toastService.error(err?.data?.message || "Tizim xatosi");
            }
        } finally {
            setLoading(false);
        }
    };
    // til qisqacha nomlari (MenuButton uchun)
    const langMap = { uz: "O'z", en: "En", ru: "Ru" };
    const langLabel =
        typeof i18n?.language === "string"
            ? (langMap[i18n.language] ?? i18n.language.toUpperCase())
            : t ? t('login.language') : 'Til';

    return (
        <Flex minH="100vh" align="center" justify="center" bg="bg" px={4}>

            <Box
                as="form"
                onSubmit={(e) => handleSubmit(e)}
                w={{ base: "100%", sm: "400px" }}
                bg="surface"
                p={8}
                rounded="xl"
                shadow="lg"
            >
                <Box>
                    {/* TIL TANLOVCHISI MENU (faqat menu btn) */}
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
                                {t('login.language')} — {langLabel}
                            </MenuButton>

                            <MenuList minW="140px">
                                <MenuItem onClick={() => i18n.changeLanguage("uz")}>🇺🇿 O'zbekcha</MenuItem>
                                <MenuItem onClick={() => i18n.changeLanguage("en")}>🇬🇧 English</MenuItem>
                                <MenuItem onClick={() => i18n.changeLanguage("ru")}>🇷🇺 Русский</MenuItem>
                            </MenuList>
                        </Menu>
                    </Flex>
                </Box>
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
                        <Image rounded={'100%'} src={LOGO} alt="" />
                    </Box>
                </Flex>

                {/* Title */}
                <Heading textAlign="center" size="lg" mb={2} color="text">
                    {t("login.title")}
                </Heading>

                {/* Subtitle */}
                <Text textAlign="center" color="gray.500" mb={6}>
                    {t("login.subtitle")}
                </Text>{/* Login input */}
                <FormControl mb={4} isInvalid={!!errors.login}>
                    <FormLabel color="text">{t("login.login")}</FormLabel>
                    <Input
                        ref={logInput}
                        placeholder="Loginni kiriting"
                        onChange={() => clearError("login")}
                    />
                    <FormErrorMessage>{errors.login}</FormErrorMessage>
                </FormControl>

                {/* Password input */}
                <FormControl mb={2} isInvalid={!!errors.password}>
                    <FormLabel color="text">{t("login.password")}</FormLabel>
                    <InputGroup>
                        <Input
                            ref={passInput}
                            type={show ? "text" : "password"}
                            placeholder="Parolni kiriting"
                            onChange={() => clearError("password")}
                        />
                        <InputRightElement
                            onClick={() => setShow(!show)}
                            children={show ? <Eye /> : <EyeClosed />}
                        />{" "}
                    </InputGroup>
                    <FormErrorMessage>{errors.password}</FormErrorMessage>
                </FormControl>

                {/* Forgot password */}
                <Flex justifyContent={"end"} mb={5}>
                    <NavLink style={{ color: '#4fc7ff', textDecoration: 'underline' }} fontSize="sm" to="/register" >
                        {t("login.noAccount")}
                    </NavLink>
                </Flex>

                {/* Login button */}
                <Button
                    type="submit"
                    style={{ cursor: loading ? "progress" : "pointer" }}
                    w="100%"
                    isLoading={loading}
                    _hover={{ bg: "secondary" }}
                    loadingText="Loading..."
                    variant="solidPrimary"
                >
                    {t("login.button")}
                </Button>
            </Box>
        </Flex>
    );
}