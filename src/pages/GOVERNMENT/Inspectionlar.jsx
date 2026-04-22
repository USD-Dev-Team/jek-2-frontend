import {
    Badge,
    Box,
    Button,
    Divider,
    Flex,
    Heading,
    HStack,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Switch,
    Text,
    useDisclosure,
    VStack,
    Collapse,
    InputGroup,
    InputLeftElement,
    Input,
    InputRightElement,
    Select,
    Skeleton,
    IconButton,
    useColorModeValue,
    ButtonGroup,
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    Grid,
    SimpleGrid,
} from "@chakra-ui/react";

import {
    ChevronDown,
    ChevronUp,
    Search,
    Users,
    X,
    LayoutGrid,
    Table2,
} from "lucide-react";

import React, { useEffect, useMemo, useState } from "react";
import adress from "../../constants/mahallas.json";
import { useTranslation } from "react-i18next";
import { apiJekData } from "../../Services/api/Jekdata";
import { useNavigate } from "react-router";

export default function HodimlarINS() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate()

    // Select value doim string bo'ladi: "", "true", "false"
    const Statuses = {
        "": t("jekEmployees.statusAll"),
        true: t("jekEmployees.statusActive"),
        false: t("jekEmployees.statusInactive"),
    };

    const lang = i18n.language || "uz";
    const addressData = adress?.[lang] ?? adress?.uz;

    const tuman = addressData?.addresses ?? {};
    const mahalla = addressData?.mahallas ?? {};

    const confirmModal = useDisclosure();

    const [debouncedIsm, setDebouncedIsm] = useState("");
    const [debouncedFamiliya, setDebouncedFamiliya] = useState("");

    const [saving, setSaving] = useState(false);
    const [hodim, setHodim] = useState([]);
    const [expandedId, setExpandedId] = useState(null);

    const [selected, setSelected] = useState(null);
    const [nextActiveValue, setNextActiveValue] = useState(null);

    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1);

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        ism: "",
        familiya: "",
        tuman: "",
        mahalla: "",
        nomer: "",
        isActive: "",
    });

    // View mode (card/table) + localStorage
    const [viewMode, setViewMode] = useState(() => {
        return localStorage.getItem("hodimlar_view_mode") || "card"; // "card" | "table"
    });

    useEffect(() => {
        localStorage.setItem("hodimlar_view_mode", viewMode);
    }, [viewMode]);

    // Theme values
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
    const expandedRowBg = useColorModeValue("gray.50", "whiteAlpha.50");

    // RU/EN muammo: mahallas keylari district tarjimasi bo'lib qolgan
    const mahallaObj = useMemo(() => {
        if (!form.tuman) return {};
        const districtKeyUz = form.tuman;
        const districtLabelTranslated = tuman?.[districtKeyUz];
        return mahalla?.[districtKeyUz] || mahalla?.[districtLabelTranslated] || {};
    }, [form.tuman, mahalla, tuman]);



    const changeForm = (e) => {
        const { name, value } = e.target;

        setForm((prev) => {
            const next = { ...prev, [name]: value };
            if (name === "tuman") next.mahalla = ""; // tuman o'zgarsa mahalla reset
            return next;
        });
    };

    const rowHoverBg = useColorModeValue("gray.50", "whiteAlpha.50");

    const resetForm = () => {
        setForm({
            ism: "",
            familiya: "",
            tuman: "",
            mahalla: "",
            nomer: "",
            isActive: "",
        });
        setExpandedId(null);
    };

    const getEmployees = async (ism, familiya) => {
        const isActiveParam = form.isActive === "" ? "" : form.isActive === "true";

        try {
            setLoading(true);
            const res = await apiJekData.getFilterJek(
                ism,
                familiya,
                form.tuman,
                form.mahalla,
                form.nomer,
                isActiveParam,
                page,
                1000000000000000,
                'INSPECTION'
            );

            setHodim(res.data.data);
            setTotalPages(res.data.meta.totalPages); // ✅
        } finally {
            setLoading(false);
        }
    };

    const activeJek = useMemo(
        () => hodim.filter((h) => h.isActive === true).length,
        [hodim]
    );

    const noActiveJek = useMemo(
        () => hodim.filter((h) => h.isActive !== true).length,
        [hodim]
    );


    // debounce ism/familiya
    useEffect(() => {
        const time = setTimeout(() => {
            setDebouncedIsm(form.ism);
            setDebouncedFamiliya(form.familiya);
        }, 500);

        return () => clearTimeout(time);
    }, [form.ism, form.familiya]);

    // filter change -> fetch
    useEffect(() => {
        getEmployees(debouncedIsm, debouncedFamiliya);
    }, [
        form.tuman,
        form.mahalla,
        form.nomer,
        form.isActive,
        debouncedIsm,
        debouncedFamiliya,
        page // ✅
    ]);
    const openConfirm = (emp, value) => {
        setSelected(emp);
        setNextActiveValue(value);
        confirmModal.onOpen();
    };

    const deActivate = async (emp) => {
        if (!emp?.id) return;

        const payload = { isActive: emp.isActive ? false : true };

        try {
            setSaving(true);
            await apiJekData.deActivation(emp.id, payload);
            confirmModal.onClose();
            await getEmployees(debouncedIsm, debouncedFamiliya);
        } finally {
            setSaving(false);
        }
    };

    const empDistrict = (emp) => emp?.addresses?.[0]?.address?.district || "-";
    const empMahalla = (emp) => emp?.addresses?.[0]?.address?.neighborhood || "-";
    const maxRow = hodim?.length


    return (
        <Box mb={10}>
            {/* FILTERS */}
            <Flex
                my={5}
                direction={'column'}
                gap={5} bg={cardBg}
                p={5}
                rounded={'16px'}
                backgroundImage={cardGradient}
            >
                <HStack w={'100%'}>
                    {/* ISM */}
                    <InputGroup w={'100%'}>
                        <InputLeftElement pointerEvents="none">
                            <Search size={16} />
                        </InputLeftElement>
                        <Input value={form.ism} name="ism" onChange={changeForm} placeholder={t("register.firstName")} />
                        {form.ism.trim() ? (
                            <InputRightElement>
                                <IconButton
                                    aria-label="clear ism"
                                    size="sm"
                                    variant="ghost"
                                    icon={<X size={16} />}
                                    onClick={() => setForm((prev) => ({ ...prev, ism: "" }))}
                                />
                            </InputRightElement>
                        ) : null}
                    </InputGroup>

                    {/* FAMILIYA */}
                    <InputGroup w={'100%'}>
                        <InputLeftElement pointerEvents="none">
                            <Search size={16} />
                        </InputLeftElement>
                        <Input
                            value={form.familiya}
                            name="familiya"
                            onChange={changeForm}
                            placeholder={t("register.lastName")}
                        />
                        {form.familiya.trim() ? (
                            <InputRightElement>
                                <IconButton
                                    aria-label="clear familiya"
                                    size="sm"
                                    variant="ghost"
                                    icon={<X size={16} />}
                                    onClick={() => setForm((prev) => ({ ...prev, familiya: "" }))}
                                />
                            </InputRightElement>
                        ) : null}
                    </InputGroup>

                    {/* TELEFON */}
                    <Input
                        w={'100%'}
                        value={form.nomer}
                        name="nomer"
                        onChange={changeForm}
                        placeholder={t("jekEmployees.phone")}
                    />
                    {/* VIEW TOGGLE */}
                    <ButtonGroup isAttached variant="outline" size="md">
                        <Button
                            leftIcon={<LayoutGrid size={16} />}
                            onClick={() => setViewMode("card")}
                            variant={viewMode === "card" ? "solid" : "outline"}
                            colorScheme="blue"
                        >
                            {t("common.card")}
                        </Button>

                        <Button
                            leftIcon={<Table2 size={16} />}
                            onClick={() => setViewMode("table")}
                            variant={viewMode === "table" ? "solid" : "outline"}
                            colorScheme="blue"
                        >
                            {t("common.table")}
                        </Button>
                    </ButtonGroup>
                </HStack>
                <HStack w={'100%'}>
                    {/* TUMAN */}
                    <Select w={'100%'} value={form.tuman} name="tuman" onChange={changeForm}>
                        <option value="">{t("common.all")}</option>
                        {Object.entries(tuman).map(([key, label]) => (
                            <option key={key} value={key}>
                                {label}
                            </option>
                        ))}
                    </Select>

                    {/* MAHALLA */}
                    <Select
                        w={'100%'}
                        value={form.mahalla}
                        name="mahalla"
                        onChange={changeForm}
                        isDisabled={!form.tuman}
                    >
                        <option value="">{t("common.all")}</option>
                        {Object.entries(mahallaObj).map(([key, label]) => (
                            <option key={key} value={key}>
                                {label}
                            </option>
                        ))}
                    </Select>

                    {/* STATUS */}
                    <Select
                        w={'100%'}
                        value={form.isActive}
                        name="isActive"
                        onChange={changeForm}
                    >
                        {Object.entries(Statuses).map(([key, label]) => (
                            <option key={key} value={key}>
                                {label}
                            </option>
                        ))}
                    </Select>

                    {/* RESET */}
                    <Button w={'100%'} variant="solidPrimary" onClick={resetForm}>
                        {t("appeals.clearFilters")}
                    </Button>
                </HStack>

            </Flex>

            {/* STATISTIKA */}
            <Flex gap={5} mb={5} wrap="wrap">
                <VStack
                    w={'auto'}
                    bg={cardBg}
                    backgroundImage={cardGradient}
                    border={cardBorder}
                    borderRadius="16px"
                    align="start"
                    p={5}
                    boxShadow={cardShadow}
                    transition="0.2s"
                    _hover={{ transform: "translateY(-3px)", boxShadow: cardShadowHover }}
                >
                    <Heading color="warning">{hodim.length}</Heading>
                    <Text display="flex" justify="center" gap={2}>
                        <Users /> {t("jekEmployees.totalEmployees")} :
                    </Text>
                </VStack>

                <VStack
                    w={'auto'}
                    bg={cardBg}
                    backgroundImage={cardGradient}
                    border={cardBorder}
                    borderRadius="16px"
                    align="start"
                    p={5}
                    boxShadow={cardShadow}
                    transition="0.2s"
                    _hover={{ transform: "translateY(-3px)", boxShadow: cardShadowHover }}
                >
                    <Heading color="success">{activeJek}</Heading>
                    <Text display="flex" justify="center" gap={2}>
                        <Users /> {t("jekEmployees.totalActiveEmployees")} :
                    </Text>
                </VStack>

                <VStack
                    w={'auto'}
                    bg={cardBg}
                    backgroundImage={cardGradient}
                    border={cardBorder}
                    borderRadius="16px"
                    align="start"
                    p={5}
                    boxShadow={cardShadow}
                    transition="0.2s"
                    _hover={{ transform: "translateY(-3px)", boxShadow: cardShadowHover }}
                >
                    <Heading color="danger">{noActiveJek}</Heading>
                    <Text display="flex" justify="center" gap={2}>
                        <Users /> {t("jekEmployees.totalInactiveEmployees")} :
                    </Text>
                </VStack>
            </Flex>

            {/* LIST */}
            {viewMode === "card" ? (
                <Flex wrap={'wrap'} gap={3}>
                    {loading ? (
                        <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={3} w="100%">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <Skeleton key={i} h="170px" borderRadius="16px" />
                            ))}
                        </SimpleGrid>
                    ) : hodim.length > 0 ? (
                        hodim.map((emp) => {
                            const isExpanded = expandedId === emp.id;

                            return (
                                <Box
                                    key={emp.id}
                                    bg={cardBg}
                                    backgroundImage={cardGradient}
                                    border={cardBorder}
                                    borderRadius="16px"
                                    px={7}
                                    py={4}
                                    w={maxRow === 1 || maxRow === 2 ? '49.5%' : '32.66%'}
                                    boxShadow={cardShadow}
                                    transition="0.2s"
                                    _hover={{ transform: "translateY(-3px)", boxShadow: cardShadowHover }}
                                >
                                    {/* HEADER */}
                                    <Flex justify="space-between" align="center">
                                        <HStack>
                                            <Heading fontSize="18px">{`${emp?.first_name} ${emp?.last_name}`}</Heading>
                                            <Badge colorScheme={emp?.isActive ? "green" : "red"}>
                                                {emp?.isActive ? t("jekEmployees.statusActive") : t("jekEmployees.statusInactive")}
                                            </Badge>
                                        </HStack>
                                    </Flex>

                                    <Divider my={3} />

                                    {/* ASOSIY */}
                                    <Text fontWeight="semibold">
                                        <span style={{ fontWeight: "normal" }}>{t("jekEmployees.phone")}:</span>
                                        +{emp?.phoneNumber || "-"}
                                    </Text>
                                    <Text fontWeight="semibold">
                                        <span style={{ fontWeight: "normal" }}>{t("jekEmployees.areaCol")}:</span>
                                        {empDistrict(emp)}, {empMahalla(emp)}
                                    </Text>

                                    <Divider my={3} />
                                    <HStack>
                                        <Button
                                            size="sm"
                                            onClick={() => navigate(`${emp.id}`)}
                                        >
                                            {t("jekEmployees.details")}
                                        </Button>
                                        <Text>
                                            {t("jekEmployees.toggle")}
                                        </Text>

                                        <Switch
                                            isChecked={!!emp?.isActive}
                                            onChange={(e) => openConfirm(emp, e.target.checked)}
                                        />

                                    </HStack>
                                </Box>
                            );
                        })
                    ) : (
                        <Text my={3} mx={'auto'} color="text" fontSize={23}>
                            {t("jekEmployees.notFound")}
                        </Text>
                    )}
                </Flex>
            ) : (
                <TableContainer
                    bg={cardBg}
                    border={cardBorder}
                    borderRadius="16px"
                    boxShadow={cardShadow}
                    backgroundImage={cardGradient}
                    overflowX="auto"
                >
                    <Table size="sm" variant="simple">
                        <Thead position="sticky" top={0} bg={cardBg} zIndex={1}>
                            <Tr>
                                <Th>{t("jekEmployees.employee")}</Th>
                                <Th>{t("common.status")}</Th>
                                <Th>{t("jekEmployees.phone")}</Th>
                                <Th>{t("jekEmployees.areaCol")}</Th>
                                <Th textAlign="end">{t("common.actions")}</Th>
                            </Tr>
                        </Thead>

                        <Tbody>
                            {loading ? (
                                [...Array(6)].map((_, i) => (
                                    <Tr key={i}>
                                        <Td colSpan={5}>
                                            <Skeleton h="28px" w="100%" rounded="md" />
                                        </Td>
                                    </Tr>
                                ))
                            ) : hodim.length > 0 ? (
                                hodim.map((emp) => {
                                    const isExpanded = expandedId === emp.id;

                                    return (
                                        <React.Fragment key={emp.id}>
                                            <Tr _hover={{ bg: rowHoverBg }}>
                                                <Td fontWeight="600">{`${emp?.first_name} ${emp?.last_name}`}</Td>

                                                <Td>
                                                    <Badge colorScheme={emp?.isActive ? "green" : "red"}>
                                                        {emp?.isActive ? t("jekEmployees.statusActive") : t("jekEmployees.statusInactive")}
                                                    </Badge>
                                                </Td>

                                                <Td>+{emp?.phoneNumber || "-"}</Td>

                                                <Td>
                                                    {empDistrict(emp)}, {empMahalla(emp)}
                                                </Td>

                                                <Td textAlign="right">
                                                    <HStack justify="flex-end">
                                                        <Button
                                                            size="sm"
                                                            onClick={() => navigate(`${emp.id}`)}
                                                        >
                                                            {t("jekEmployees.details")}
                                                        </Button>

                                                        <HStack>
                                                            {t("jekEmployees.statusActive")}
                                                            <Switch
                                                                isChecked={!!emp?.isActive}
                                                                onChange={(e) => openConfirm(emp, e.target.checked)}
                                                            />
                                                        </HStack>
                                                    </HStack>
                                                </Td>
                                            </Tr>
                                        </React.Fragment>
                                    );
                                })
                            ) : (
                                <Tr>
                                    <Td colSpan={5}>
                                        <Text my={3} textAlign={'center'} color="text" fontSize={23}>
                                            {t("jekEmployees.notFound")}
                                        </Text>
                                    </Td>
                                </Tr>
                            )}
                        </Tbody>
                    </Table>
                </TableContainer>
            )}

            {totalPages > 1 && (
                <Flex mt={5} justify="center" gap={3}>
                    <Button
                        onClick={() => setPage(prev => prev - 1)}
                        isDisabled={page === 0}
                    >
                        Prev
                    </Button>

                    <Text>{page + 1} / {totalPages}</Text>

                    <Button
                        onClick={() => setPage(prev => prev + 1)}
                        isDisabled={page + 1 === totalPages}
                    >
                        Next
                    </Button>
                </Flex>
            )}

            {/* CONFIRM MODAL */}
            <Modal isOpen={confirmModal.isOpen} onClose={confirmModal.onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalCloseButton />

                    <ModalHeader>{nextActiveValue ? t("jekEmployees.confirmActivateTitle") : t("jekEmployees.confirmDeactivateTitle")}</ModalHeader>

                    <ModalBody>
                        <Text>{nextActiveValue ? t("jekEmployees.confirmActivateText") : t("jekEmployees.confirmDeactivateText")}</Text>

                        <Text mt={3}>
                            {t("jekEmployees.employee")}:{" "}
                            <b>{selected ? `${selected.first_name} ${selected.last_name}` : "-"}</b>
                        </Text>
                    </ModalBody>

                    <ModalFooter gap={3}>
                        <Button onClick={confirmModal.onClose}>{t("common.cancel")}</Button>
                        <Button onClick={() => deActivate(selected)} colorScheme="blue" isLoading={saving}>
                            {t("common.confirm")}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
}