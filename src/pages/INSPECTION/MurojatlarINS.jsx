import React, { useEffect, useMemo, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Skeleton,
  Text,
  useColorModeValue,
  useDisclosure,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  ButtonGroup
} from "@chakra-ui/react";
import { LayoutGrid, Search, Table2, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import { apiAriza } from "../../Services/api/Ariza";
import { apiJekData } from "../../Services/api/Jekdata";
import { formatDateTime } from "../../utils/tools/formatDateTime";
import adress from "../../constants/mahallas.json";
import { IMAGE_URL } from "../../constants/imageUrl";

export default function Murojatlar() {
  const { t, i18n } = useTranslation();
  const korishModal = useDisclosure();


  const lang = i18n.language || "uz";
  const addressData = adress?.[lang] ?? adress?.uz;


  const tuman = addressData?.addresses ?? {};

  const mahalla = addressData?.mahallas ?? {};

  //UI/UX state
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [ariza, setAriza] = useState([]);
  const [korish, setKorish] = useState(null);

  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    startData: today,
    endData: today,
    status: "",
    search: "",
    tuman: "",
    mahalla: "",
  });

  //Statuses
  const Statuses = {
    "": t("appeals.statusAll"),
    PENDING: t("appeals.status_pending"),
    IN_PROGRESS: t("appeals.status_in_progress"),
    COMPLETED: t("appeals.status_completed_user"),
    REJECTED: t("appeals.status_rejected_user"),
    JEK_REJECTED: t("appeals.status_rejected"),
    JEK_COMPLETED: t("appeals.status_completed"),
  }

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

      if (name === "tuman") next.mahalla = "";
      return next;
    });
  };

  const resetForm = () => {
    setForm({
      startData: today,
      endData: today,
      status: "",
      search: "",
      tuman: "",
      mahalla: "",
    });
  };

  const calculateDays = (start, end) => {
    if (!start || !end) return null;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = endDate - startDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const openKorishModal = (item) => {
    const needAriza = ariza.find((i) => i.id === item.id);
    setKorish(needAriza || item);
    korishModal.onOpen();
  };

  //API calls 
  const getAriza = async (text) => {
    try {
      setLoading(true);
      const res = await apiAriza.getFilteredRequest(
        form.startData,
        form.endData,
        form.tuman,
        form.mahalla,
        form.status,
        text
      );
      setAriza(res.data.data);
    } finally {
      setLoading(false);
    }
  };


  // debounce search
  useEffect(() => {
    const time = setTimeout(() => {
      setDebouncedQuery(form.search);
    }, 500);
    return () => clearTimeout(time);
  }, [form.search]);


  useEffect(() => {
    getAriza(debouncedQuery);
  }, [
    form.startData,
    form.endData,
    form.tuman,
    form.mahalla,
    form.status,
    debouncedQuery,
  ]);

  const statusColorScheme = (status) => {
    if (status === "PENDING") return "yellow";
    if (status === "IN_PROGRESS") return "blue";
    if (status === "JEK_COMPLETED" || status === "COMPLETED") return "green";
    if (status === "REJECTED" || status === "JEK_REJECTED") return "red";
    return "gray";
  };

  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem("murojatlar_view_mode") || "card";
  });

  useEffect(() => {
    localStorage.setItem("murojatlar_view_mode", viewMode);
  }, [viewMode]);

  const rowHoverBg = useColorModeValue("gray.50", "whiteAlpha.50");

  return (
    <Box>
      {/* FILTERS */}
      <Flex mb={4} alignItems="center" justify={'center'} direction={'column'} gap={3} wrap="wrap" w={'100%'}>
        <HStack w={'100%'}>


          {/* SEARCH */}
          <InputGroup w={'100%'}>
            <InputLeftElement pointerEvents="none" ml={2}>
              <Search size={16} />
            </InputLeftElement>

            <Input
              value={form.search}
              name="search"
              onChange={changeForm}
              placeholder={t("appeals.searchPlaceholder")}
            />

            {form.search.trim() ? (
              <InputRightElement mr={1}>
                <IconButton
                  aria-label="clear search"
                  size="sm"
                  variant="ghost"
                  onClick={() => setForm((prev) => ({ ...prev, search: "" }))}
                  icon={<X size={16} />}
                />
              </InputRightElement>
            ) : null}
          </InputGroup>

          {/* TUMAN */}
          <Select w={'100%'} value={form.tuman} name="tuman" onChange={changeForm}>
            <option value="">{t("common.all") || "Hammasi"}</option>
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
            <option value="">{t("common.all") || "Hammasi"}</option>
            {Object.entries(mahallaObj).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </Select>

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
          {/* STATUS */}
          <Select w={'100%'} value={form.status} name="status" onChange={changeForm}>
            {Object.entries(Statuses).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </Select>

          {/* BOSHLANISH SANA */}
          <Input
            w={'100%'}
            value={form.startData}
            name="startData"
            onChange={changeForm}
            placeholder={t("appeals.startDate")}
            type="date"
          />

          {/* TUGASH SANA */}
          <Input
            w={'100%'}
            value={form.endData}
            name="endData"
            onChange={changeForm}
            placeholder={t("appeals.endDate")}
            type="date"
          />

          {/* RESET */}
          <Button
            w={'100%'}
            variant={'solidPrimary'}
            onClick={resetForm}
          >
            {t("appeals.clearFilters")}
          </Button>
        </HStack>
      </Flex>

      {/* LIST */}
      {
        viewMode === "card" ? (
          <Flex flexDirection="column" gap={3}>
            {loading ? (
              <Flex direction="column" gap={3}>
                {[1, 2, 3, 4, 5, 6].map((e) => (
                  <Skeleton key={e} h="130px" w="100%" rounded={10} />
                ))}
              </Flex>
            ) : ariza?.length > 0 ? (
              ariza.map((item) => {
                const days = calculateDays(item.createdAt, item.completedAt);

                return (
                  <Box
                    key={item.id}
                    bg={cardBg}
                    backgroundImage={cardGradient}
                    border={cardBorder}
                    borderRadius="16px"
                    px={7}
                    py={4}
                    boxShadow={cardShadow}
                    transition="0.2s"
                    _hover={{ transform: "translateY(-3px)", boxShadow: cardShadowHover }}
                  >
                    {/* sizdagi card content (o'zgarmagan) */}
                    <Flex align="start" justify="space-between">
                      <HStack alignItems="center">
                        <Text mb={2} fontWeight="semibold">
                          {item.request_number}
                        </Text>
                        <Text mb={3}>|</Text>
                        <Badge mb={2} colorScheme={statusColorScheme(item.status)}>
                          {Statuses[item?.status] || item?.status}
                        </Badge>
                      </HStack>

                      <VStack align="end" spacing={1}>
                        <Text fontWeight="bold">
                          <span style={{ fontWeight: "normal" }}>Hodim:</span>{" "}
                          {item?.assigned_jek
                            ? `${item?.assigned_jek?.first_name} ${item?.assigned_jek?.last_name}`
                            : "Topilmadi"}
                        </Text>
                        <Text fontWeight="bold">
                          <span style={{ fontWeight: "normal" }}>Davomiyligi:</span>{" "}
                          {days !== null ? `${days} kun` : "Tugamagan"}
                        </Text>
                        <Text fontWeight="bold">
                          <span style={{ fontWeight: "normal" }}>Hudud:</span>{" "}
                          {`${item?.address?.district || "-"} , ${item?.address?.neighborhood || "-"}`}
                        </Text>
                      </VStack>
                    </Flex>

                    <Divider mb={3} mt={2} h="1px" bg="gray.200" opacity={0.6} />

                    <Flex alignItems="start" justifyContent="space-between">
                      <VStack alignItems="start" spacing={1}>
                        <HStack>
                          <Text>{item?.user?.full_name}</Text>
                          <Text>+{item?.user?.phoneNumber}</Text>
                        </HStack>
                        <Text>{formatDateTime(item.createdAt)}</Text>
                      </VStack>

                      <Button onClick={() => openKorishModal(item)}>
                        {t("common.view")}
                      </Button>
                    </Flex>
                  </Box>
                );
              })
            ) : (
              <Text color="red.400" fontSize={22}>
                {t("appeals.notFound")}
              </Text>
            )}
          </Flex>
        ) : (
          <TableContainer
            bg={cardBg}
            border={cardBorder}
            borderRadius="16px"
            boxShadow={cardShadow}
            overflowX="auto"
          >
            <Table size="sm" variant="simple">
              <Thead position="sticky" top={0} bg={cardBg} zIndex={1}>
                <Tr>
                  <Th>№</Th>
                  <Th>Status</Th>
                  <Th>Hodim</Th>
                  <Th>Davomiyligi</Th>
                  <Th>Hudud</Th>
                  <Th>Murojaatchi</Th>
                  <Th>Telefon</Th>
                  <Th>Yaratilgan</Th>
                  <Th textAlign="right">Action</Th>
                </Tr>
              </Thead>

              <Tbody>
                {loading ? (
                  [...Array(6)].map((_, i) => (
                    <Tr key={i}>
                      <Td colSpan={9}>
                        <Skeleton h="28px" w="100%" rounded="md" />
                      </Td>
                    </Tr>
                  ))
                ) : ariza?.length > 0 ? (
                  ariza.map((item) => {
                    const days = calculateDays(item.createdAt, item.completedAt);

                    return (
                      <Tr key={item.id} _hover={{ bg: rowHoverBg }}>
                        <Td fontWeight="600">{item.request_number}</Td>

                        <Td>
                          <Badge colorScheme={statusColorScheme(item.status)}>
                            {Statuses[item?.status] || item?.status}
                          </Badge>
                        </Td>

                        <Td>
                          {item?.assigned_jek
                            ? `${item.assigned_jek.first_name} ${item.assigned_jek.last_name}`
                            : "Topilmadi"}
                        </Td>

                        <Td>{days !== null ? `${days} kun` : "Tugamagan"}</Td>

                        <Td>
                          {item?.address?.district || "-"}, {item?.address?.neighborhood || "-"}
                        </Td>

                        <Td>{item?.user?.full_name || "-"}</Td>
                        <Td>+{item?.user?.phoneNumber || "-"}</Td>
                        <Td>{formatDateTime(item.createdAt)}</Td>

                        <Td textAlign="right">
                          <Button size="sm" onClick={() => openKorishModal(item)}>
                            {t("common.view")}
                          </Button>
                        </Td>
                      </Tr>
                    );
                  })
                ) : (
                  <Tr>
                    <Td colSpan={9}>
                      <Text color="red.400" fontSize={18}>
                        {t("appeals.notFound")}
                      </Text>
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </TableContainer>
        )
      }

      {/* KORISH_MODAL */}
      <Modal isOpen={korishModal.isOpen} onClose={korishModal.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>
            <Text>{korish?.request_number}</Text>
            <Heading fontSize="30px" mb={0}>
              {korish?.user?.full_name}
            </Heading>
            <Text fontSize="17px" fontWeight="light" mb={3}>
              +{korish?.user?.phoneNumber}
            </Text>
            <Divider />
          </ModalHeader>

          <ModalBody>
            <Text mb={2} fontWeight="bold">
              <span style={{ color: "#778092" }}>
                {t("appeals.view.status")} :
              </span>{" "}
              <Badge colorScheme={statusColorScheme(korish?.status)}>
                {Statuses[korish?.status] || korish?.status}
              </Badge>
            </Text>

            <Text mb={2} fontWeight="bold">
              <span style={{ color: "#778092" }}>
                {t("appeals.view.type")} :
              </span>{" "}
              {korish?.description || "-"}
            </Text>

            <Text mb={2} fontWeight="bold">
              <span style={{ color: "#778092" }}>
                {t("appeals.view.startedAt")} :
              </span>{" "}
              {formatDateTime(korish?.createdAt)}
            </Text>

            <Text mb={2} fontWeight="bold">
              <span style={{ color: "#778092" }}>
                {t("appeals.view.endedAt")} :
              </span>{" "}
              {!korish?.completedAt ? "Tugamagan" : formatDateTime(korish.completedAt)}
            </Text>

            <Divider mb={4} mt={6} />

            <Text mb={2} fontWeight="bold">
              <span style={{ color: "#778092" }}>
                {t("appeals.view.note")} :
              </span>{" "}
              {korish?.note ? korish.note : "Izoh yo'q"}
            </Text>

            <Divider mb={4} mt={6} />

            <Flex gap={4} align="center">
              <Text fontWeight="bold" color="#778092">
                Rasm :
              </Text>

              <Box border="2px dashed" borderColor="gray.300" borderRadius="xl" p={3}>
                <Image
                  borderRadius="lg"
                  w={150}
                  src={
                    korish?.requestPhotos?.length
                      ? `${IMAGE_URL}${korish.requestPhotos[0].file_url}`
                      : "/no-image.png"
                  }
                  alt={korish?.requestPhotos?.length ? "rasm" : "rasm yo'q"}
                />
              </Box>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button onClick={korishModal.onClose} variant="outlinePrimary">
              {t("common.close")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box >
  );
}