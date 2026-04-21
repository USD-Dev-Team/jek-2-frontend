import { Badge, Button, Collapse, Divider, Flex, HStack, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Skeleton, Switch, Text, useColorModeValue, useDisclosure, VStack, InputGroup, InputRightElement, IconButton } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { apiJekData } from '../../Services/api/Jekdata'
import { useTranslation } from 'react-i18next'
import { formatDateTime } from '../../utils/tools/formatDateTime'
import Cookies from 'js-cookie'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'

export default function Profile() {
    const id = Cookies.get('user_id')
    const { t } = useTranslation();

    //UI states
    const [loading, setLoading] = useState(false)
    const [param, setParam] = useState({})
    const [saving, setSaving] = useState(false);
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const [profil, setProfil] = useState({
        first_name: "",
        last_name: "",
        phoneNumber: ""
    })
    const [parol, setParol] = useState({
        password: "",
        passwordConfirm: ""
    })

    const confirmModal = useDisclosure();
    const [nextActiveValue, setNextActiveValue] = useState(null);

    // YANGI: qaysi panel ochiq
    const [activePanel, setActivePanel] = useState(null) // 'profil' | 'parol' | 'mahalla' | null
    const togglePanel = (panel) => setActivePanel(prev => prev === panel ? null : panel)

    //Functional
    const getJEK = async () => {
        try {
            setLoading(true)
            const res = await apiJekData.DataGet()
            setParam(res.data.data)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getJEK()
    }, [])
    useEffect(() => {
        if (param) {
            setProfil({
                first_name: param.first_name || "",
                last_name: param.last_name || "",
                phoneNumber: param.phoneNumber || ""
            })
        }
    }, [param])

    const cardBg = useColorModeValue("#ffffff", "#0B1C26");
    const cardGradient = useColorModeValue(
        "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
        "linear-gradient(180deg, #0B1C26 0%, #07141e 100%)"
    );
    const cardBorder = useColorModeValue(
        "1px solid rgba(0,0,0,0.06)",
        "1px solid rgba(255,255,255,0.06)"
    );
    const cardShadow = useColorModeValue(
        "0 10px 25px rgba(0,0,0,0.06)",
        "0 18px 55px rgba(0,0,0,0.45)"
    );
    const cardShadowHover = useColorModeValue(
        "0 14px 32px rgba(0,0,0,0.10)",
        "0 24px 70px rgba(0,0,0,0.55)"
    );

    const adLenght = param?.addresses?.length

    const changeProfil = (e) => {
        const { name, value } = e.target;
        setProfil((prev) => ({ ...prev, [name]: value }));
    };
    const changeParol = (e) => {
        const { name, value } = e.target;
        setParol((prev) => ({ ...prev, [name]: value }));
    };

    function formatPhone(phone) {
        if (!phone) return ""
        const digits = phone.replace(/\D/g, "")
        if (digits.length !== 12) return phone
        return `+${digits.slice(0, 3)} ${digits.slice(3, 5)}-${digits.slice(5, 8)}-${digits.slice(8, 10)}-${digits.slice(10, 12)}`
    }

    const deActivate = async (param) => {
        if (!param?.id) return;
        const payload = { isActive: param?.isActive ? false : true };
        try {
            setSaving(true);
            await apiJekData.deActivation(param.id, payload);
            confirmModal.onClose();
            getJEK()
        } finally {
            setSaving(false);
        }
    };

    const profilChange = async () => {
        try {
            setSaving(true)
            await apiJekData.profil(id, profil.first_name, profil.last_name, profil.phoneNumber)
            getJEK()
            setActivePanel(null)
        } finally {
            setSaving(false)
        }
    }
    const parolChange = async () => {
        try {
            setSaving(true)
            await apiJekData.parol(id, parol.password, parol.passwordConfirm)
            getJEK()
            setParol({ password: '', passwordConfirm: '' })
            setActivePanel(null)
        } finally {
            setSaving(false)
        }
    }

    return (
        <div>
            {loading ? (
                <Skeleton rounded={'16px'} mt={5} w={'100%'} h={'300px'} />
            ) : (
                <Flex
                    bg={cardBg}
                    backgroundImage={cardGradient}
                    border={cardBorder}
                    borderRadius="16px"
                    px={7}
                    py={7}
                    my={5}
                    w={'100%'}
                    boxShadow={cardShadow}
                    transition="0.2s"
                    _hover={{ transform: "translateY(-3px)", boxShadow: cardShadowHover }}
                    direction={'column'}
                    mb={4}
                >
                    <HStack align={'start'} spacing={8} w="100%" flexWrap={{ base: 'wrap', lg: 'nowrap' }}>
                        <VStack flex="1" minW="260px" align={'start'} gap={1}>
                            <span style={{ color: '#778092', fontWeight: 'bold' }}>
                                {t("jekEmployees.employee")}
                            </span>

                            <Text>
                                <span style={{ color: '#778092' }}>{t("common.role")}: </span>
                                {param?.role}
                            </Text>

                            <Text>
                                <span style={{ color: '#778092' }}>{t("common.status")}: </span>
                                <Badge colorScheme={param?.isActive ? "green" : "red"}>
                                    {param?.isActive
                                        ? t("jekEmployees.statusActive")
                                        : t("jekEmployees.statusInactive")}
                                </Badge>
                            </Text>
                        </VStack>

                        <VStack flex="1" minW="260px" align={'start'} gap={1}>
                            <span style={{ color: '#778092', fontWeight: 'bold' }}>
                                {t("jekEmployees.employee")}
                            </span>

                            <Text>
                                <span style={{ color: '#778092' }}>{t("common.role")}: </span>
                                {param?.role}
                            </Text>

                            <Text>
                                <span style={{ color: '#778092' }}>{t("common.status")}: </span>
                                <Badge colorScheme={param?.isActive ? "green" : "red"}>
                                    {param?.isActive
                                        ? t("jekEmployees.statusActive")
                                        : t("jekEmployees.statusInactive")}
                                </Badge>
                            </Text>                            {param?.addresses && param.addresses.length > 0 ? (
                                param.addresses.map((item) => (
                                    <VStack key={item.id} align={'start'} gap={1} w="100%">
                                        <Text>
                                            {item.district}, {item.neighborhood}
                                        </Text>
                                    </VStack>
                                ))
                            ) : (
                                <Text color="#778092">Manzil mavjud emas</Text>
                            )}
                        </VStack>

                        <VStack align={'end'} spacing={3} minW="220px">
                            <Button
                                w="210px"
                                rounded="12px"
                                variant={activePanel === 'profil' ? 'solidPrimary' : 'outline'}
                                onClick={() => togglePanel('profil')}
                            >
                                {t("jekEmployees.editProfile")}
                            </Button>

                            <Button
                                w="210px"
                                rounded="12px"
                                variant={activePanel === 'parol' ? 'solidPrimary' : 'outline'}
                                onClick={() => togglePanel('parol')}
                            >
                                {t("jekEmployees.changePassword")}
                            </Button>
                        </VStack>
                    </HStack>

                    {activePanel && <Divider w={'100%'} my={7} />}
                    <Collapse in={!!activePanel} animateOpacity>
                        <Flex justify="center" w="100%">
                            {/* 1- PANEL */}
                            {activePanel === 'profil' && (
                                <VStack w={{ base: '100%', md: '420px' }} spacing={3}>
                                    <Text color="#778092" fontWeight="bold">
                                        {t("jekEmployees.editProfileTitle")}
                                    </Text>

                                    <Input
                                        value={profil.first_name}
                                        name='first_name'
                                        onChange={changeProfil}
                                        rounded={'16px'}
                                        placeholder={t("register.firstNamePlaceholder")}
                                    />

                                    <Input
                                        value={profil.last_name}
                                        name='last_name'
                                        onChange={changeProfil}
                                        rounded={'16px'}
                                        placeholder={t("register.lastNamePlaceholder")}
                                    />

                                    <Input
                                        value={profil.phoneNumber}
                                        name='phoneNumber'
                                        onChange={changeProfil}
                                        rounded={'16px'}
                                        placeholder={t("register.phonePlaceholder")}
                                    />

                                    <Button
                                        w={'100%'}
                                        variant={'solidPrimary'}
                                        rounded={'16px'}
                                        onClick={profilChange}
                                        isLoading={saving}
                                    >
                                        {t("common.confirm")}
                                    </Button>
                                </VStack>
                            )}
                            {/* 2- PANEL */}
                            {activePanel === 'parol' && (
                                <VStack w={{ base: '100%', md: '420px' }} spacing={3}>
                                    <Text color="#778092" fontWeight="bold">
                                        {t("jekEmployees.changePasswordTitle")}
                                    </Text>

                                    {/* PASSWORD */}
                                    <InputGroup>
                                        <Input
                                            value={parol.password}
                                            name='password'
                                            onChange={changeParol}
                                            rounded={'16px'}
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

                                    {/* CONFIRM PASSWORD */}
                                    <InputGroup>
                                        <Input
                                            value={parol.passwordConfirm}
                                            name='passwordConfirm'
                                            onChange={changeParol}
                                            rounded={'16px'}
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

                                    <Button
                                        w={'100%'}
                                        variant={'solidPrimary'}
                                        rounded={'16px'}
                                        onClick={parolChange}
                                        isLoading={saving}
                                    >
                                        {t("common.confirm")}
                                    </Button>
                                </VStack>
                            )}
                        </Flex>
                    </Collapse>
                </Flex>
            )}

            <Modal isOpen={confirmModal.isOpen} onClose={confirmModal.onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalCloseButton />
                    <ModalHeader>{nextActiveValue ? t("jekEmployees.confirmActivateTitle") : t("jekEmployees.confirmDeactivateTitle")}</ModalHeader>
                    <ModalBody>
                        <Text>{nextActiveValue ? t("jekEmployees.confirmActivateText") : t("jekEmployees.confirmDeactivateText")}</Text>
                        <Text mt={3}>{t("jekEmployees.employee")}: <b>{param ? `${param?.first_name} ${param?.last_name}` : "-"}</b></Text>
                    </ModalBody>
                    <ModalFooter gap={3}>
                        <Button onClick={confirmModal.onClose}>{t("common.cancel")}</Button>
                        <Button onClick={() => deActivate(param)} colorScheme="blue" isLoading={saving}>{t("common.confirm")}</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}