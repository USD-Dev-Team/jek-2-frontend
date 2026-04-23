import {
    Badge, Button, Collapse, Divider, Flex, HStack, Input,
    Modal, ModalBody, ModalCloseButton, ModalContent,
    ModalFooter, ModalHeader, ModalOverlay, Skeleton,
    Switch, Text, useColorModeValue, useDisclosure,
    VStack, InputGroup, InputRightElement, IconButton,
    SimpleGrid,
    Box
} from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { apiJekData } from '../../Services/api/Jekdata'
import { useTranslation } from 'react-i18next'
import { formatDateTime } from '../../utils/tools/formatDateTime'
import { apiDashboard } from '../../Services/api/Dashboar'
import Cookies from 'js-cookie'

export default function JekMalumoti() {
    const { id } = useParams()
    const { t } = useTranslation();

    //UI states
    const [loading, setLoading] = useState(false)
    const [param, setParam] = useState({})
    const [saving, setSaving] = useState(false);
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [statData, setStatData] = useState(null);

    const [profil, setProfil] = useState({
        first_name: "",
        last_name: "",
        phoneNumber: ""
    })
    const [parol, setParol] = useState({
        password: "",
        passwordConfirm: ""
    })
    const [mahalla, setMahalla] = useState({
        district: "",
        neighborhood: ""
    })

    const confirmModal = useDisclosure();
    const [nextActiveValue, setNextActiveValue] = useState(null);

    const role = Cookies.get('role')
    const notAllowed = ['INSPECTION'].includes(param?.role)

    // YANGI: qaysi panel ochiq
    const [activePanel, setActivePanel] = useState(null) // 'profil' | 'parol' | 'mahalla' | null
    const togglePanel = (panel) => setActivePanel(prev => prev === panel ? null : panel)

    //Functional
    const getJEK = async () => {
        try {
            setLoading(true)
            const res = await apiJekData.getById(id)
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

    const statusMap = React.useMemo(() => {
        const arr = statData?.statuses ?? [];
        return arr.reduce((acc, s) => {
            acc[s.status] = s?._count?.id ?? 0;
            return acc;
        }, {});
    }, [statData]);

    const totalCount = statData?.totalRequests ?? 0;
    const completedCount = (statusMap.COMPLETED ?? 0) + (statusMap.JEK_COMPLETED ?? 0);
    const inProgressCount = statusMap.IN_PROGRESS ?? 0;
    const rejectedCount = statusMap.REJECTED ?? 0;

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
    const changeMahalla = (e) => {
        const { name, value } = e.target;
        setMahalla((prev) => ({ ...prev, [name]: value }));
    };

    function formatPhone(phone) {
        if (!phone) return ""
        const digits = phone.replace(/\D/g, "")
        if (digits.length !== 12) return phone
        return `+${digits.slice(0, 3)} ${digits.slice(3, 5)}-${digits.slice(5, 8)}-${digits.slice(8, 10)}-${digits.slice(10, 12)}`
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
    const mahallaChange = async () => {
        try {
            setSaving(true)
            await apiJekData.mahalla(id, mahalla.district, mahalla.neighborhood)
            getJEK()
            setMahalla({ district: '', neighborhood: '' })
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
                            <Text>{param?.first_name} {param?.last_name}</Text>
                            <Text>{formatPhone(param?.phoneNumber)}</Text>
                            <Text>
                                <span style={{ color: '#778092' }}>
                                    {t("common.role")}:{" "}
                                </span>
                                {param?.role}
                            </Text>
                            <Text>  <span style={{ color: '#778092' }}>
                                {t("common.status")}:{" "}
                            </span>
                                <Badge colorScheme={param?.isActive ? "green" : "red"}>
                                    {param?.isActive ? t("jekEmployees.statusActive") : t("jekEmployees.statusInactive")}
                                </Badge>
                            </Text>
                            {notAllowed ? '' :

                                <HStack>
                                    <Text>{t("jekEmployees.toggle")}</Text>
                                    <Switch isChecked={!!param?.isActive} onChange={(e) => openConfirm(param, e.target.checked)} />
                                </HStack>
                            }
                        </VStack>

                        <VStack flex="1" minW="260px" align={'start'} gap={1}>
                            {notAllowed ? '' :
                                <span style={{ color: '#778092', fontWeight: 'bold' }}>
                                    {adLenght === 1
                                        ? t("jekEmployees.addressSingle")
                                        : t("jekEmployees.addressPlural")}
                                </span>
                            }

                            {param?.addresses?.map((item) => (
                                <VStack key={item.address.id} align={'start'} gap={1} w="100%">
                                    <Text>{item.address.district}, {item.address.neighborhood}</Text>
                                    <Text>  <span style={{ color: '#778092' }}>
                                        {t("common.createdAt")}:{" "}
                                    </span>
                                        {formatDateTime(item.address.createdAt)}</Text>
                                    <Text>  <span style={{ color: '#778092' }}>
                                        {t("common.updatedAt")}:{" "}
                                    </span>{formatDateTime(item.address.updatedAt)}</Text>
                                    <Divider w={'100%'} bg={'white'} mt={1} mb={4} />
                                </VStack>
                            ))}
                        </VStack>
                        {notAllowed ? '' :

                            <VStack align={'end'} spacing={3} minW="220px">
                                <Button w="210px" rounded="12px" variant={activePanel === 'profil' ? 'solidPrimary' : 'outline'} onClick={() => togglePanel('profil')}>
                                    {t("jekEmployees.editProfile")}
                                </Button>
                                <Button w="210px" rounded="12px" variant={activePanel === 'parol' ? 'solidPrimary' : 'outline'} onClick={() => togglePanel('parol')}>
                                    {t("jekEmployees.editProfile")}
                                </Button>
                                <Button w="210px" rounded="12px" variant={activePanel === 'mahalla' ? 'solidPrimary' : 'outline'} onClick={() => togglePanel('mahalla')}>
                                    {t("jekEmployees.addAddress")}
                                </Button>
                            </VStack>
                        }
                    </HStack>

                    <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mt={8}>
                        {notAllowed ? '' : <>
                            {/* JAMI */}
                            <Box
                                p={6}
                                borderRadius="18px"
                                bg={cardBg}
                                border={cardBorder}
                                boxShadow={cardShadow}
                                transition="0.2s"

                            >
                                <Text fontSize="12px" color="gray.500" mb={2}>
                                    {t("dashboard.totalAppeals")}
                                </Text>
                                <Text fontSize="30px" fontWeight="700">
                                    {totalCount}
                                </Text>
                            </Box>

                            {/* BAJARILGAN */}
                            <Box
                                p={6}
                                borderRadius="18px"
                                bg={useColorModeValue("green.50", "rgba(72,187,120,0.12)")}
                                border="1px solid"
                                borderColor={useColorModeValue("green.200", "rgba(72,187,120,0.4)")}
                                boxShadow={cardShadow}
                                transition="0.2s"

                            >
                                <Text fontSize="12px" color="green.500" mb={2}>
                                    {t("dashboard.completed")}
                                </Text>
                                <Text fontSize="30px" fontWeight="700" color="green.500">
                                    {completedCount}
                                </Text>
                            </Box>

                            {/* JARAYONDA */}
                            <Box
                                p={6}
                                borderRadius="18px"
                                bg={useColorModeValue("yellow.50", "rgba(247,201,72,0.12)")}
                                border="1px solid"
                                borderColor={useColorModeValue("yellow.300", "rgba(247,201,72,0.4)")}
                                boxShadow={cardShadow}
                                transition="0.2s"

                            >
                                <Text fontSize="12px" color="yellow.600" mb={2}>
                                    {t("dashboard.inProgress")}
                                </Text>
                                <Text fontSize="30px" fontWeight="700" color="yellow.600">
                                    {inProgressCount}
                                </Text>
                            </Box>

                            {/* RAD ETILGAN */}
                            <Box
                                p={6}
                                borderRadius="18px"
                                bg={useColorModeValue("red.50", "rgba(245,101,101,0.12)")}
                                border="1px solid"
                                borderColor={useColorModeValue("red.200", "rgba(245,101,101,0.4)")}
                                boxShadow={cardShadow}
                                transition="0.2s"

                            >
                                <Text fontSize="12px" color="red.500" mb={2}>
                                    {t("dashboard.rejected")}
                                </Text>
                                <Text fontSize="30px" fontWeight="700" color="red.500">
                                    {rejectedCount}
                                </Text>
                            </Box>
                        </>}


                    </SimpleGrid>

                    {activePanel && <Divider w={'100%'} my={7} />}
                    <Collapse in={!!activePanel} animateOpacity>
                        <Flex justify="center" w="100%">
                            {activePanel === 'profil' && (
                                <VStack w={{ base: '100%', md: '420px' }} spacing={3}>
                                    <Text color="#778092" fontWeight="bold">{t("jekEmployees.editProfileTitle")}</Text>
                                    <Input value={profil.first_name} name='first_name' onChange={changeProfil} rounded={'16px'} placeholder={t("register.firstNamePlaceholder")} />
                                    <Input value={profil.last_name} name='last_name' onChange={changeProfil} rounded={'16px'} placeholder={t("register.lastNamePlaceholder")} />
                                    <Input defaultValue={'+998'} value={profil.phoneNumber} name='phoneNumber' onChange={changeProfil} rounded={'16px'} placeholder={t("register.phonePlaceholder")} />
                                    <Button w={'100%'} variant={'solidPrimary'} rounded={'16px'} onClick={profilChange} isLoading={saving}>
                                        {t('common.confirm')}
                                    </Button>
                                </VStack>
                            )}
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
                                        {t('common.confirm')}
                                    </Button>
                                </VStack>
                            )}
                            {activePanel === 'mahalla' && (
                                <VStack w={{ base: '100%', md: '420px' }} spacing={3}>
                                    <Text color="#778092" fontWeight="bold">{t("jekEmployees.addAddressTitle")}</Text>
                                    <Input value={mahalla.district} name='district' onChange={changeMahalla} rounded={'16px'} placeholder={t("register.districtPlaceholder")} />
                                    <Input value={mahalla.neighborhood} name='neighborhood' onChange={changeMahalla} rounded={'16px'} placeholder={t("register.mahallaPlaceholder")} />
                                    <Button w={'100%'} variant={'solidPrimary'} rounded={'16px'} onClick={mahallaChange} isLoading={saving}>
                                        {t('common.confirm')}
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