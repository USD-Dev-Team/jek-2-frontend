import { Badge, Box, Button, ButtonGroup, Checkbox, Divider, useColorModeValue, Flex, Heading, HStack, Icon, Image, Input, InputGroup, InputLeftElement, InputRightElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Skeleton, Table, TableContainer, Tbody, Td, Text, Textarea, Th, Thead, Tr, useDisclosure, VStack, SimpleGrid, IconButton } from '@chakra-ui/react'
import { ChevronLeft, ChevronRight, LayoutGrid, Maximize2, Search, Table2, Trash2, UploadCloud, X } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { apiAriza } from '../../Services/api/Ariza'
import { formatDateTime } from '../../utils/tools/formatDateTime'
import { useTranslation } from "react-i18next";
import { IMAGE_URL } from '../../constants/imageUrl'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router'


export default function Murojatlar() {
  const { t } = useTranslation();
  const navigate = useNavigate()

  const Statuses = {
    '': t("appeals.statusAll"),
    PENDING: t("appeals.status_pending"),
    IN_PROGRESS: t("appeals.status_in_progress"),
    COMPLETED: t("appeals.status_completed_user"),
    REJECTED: t("appeals.status_rejected_user"),
    JEK_REJECTED: t("appeals.status_rejected"),
    JEK_COMPLETED: t("appeals.status_completed"),
  };


  //UI states
  const [debouncedQwery, setDebouncedQwery] = useState('')


  const [loading, setLoading] = useState(false)
  const [ariza, setAriza] = useState([])




  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(15)
  const [totalPages, setTotalPages] = useState(1)


  //UX states
  const [form, setForm] = useState({
    startData: null,
    endData: null,
    status: '' || null,
    search: ""
  })



  //getAriza
  const getAriza = async (text) => {
    try {
      setLoading(true)
      const res = await apiAriza.getFilteredRequest(
        form.startData || null,
        form.endData || null,
        Cookies.get('district'),
        Cookies.get('neighborhood'),
        form.status,
        text,
        page,
        limit
      )

      setAriza(res.data.data)
      setTotalPages(res.data.meta.totalPages)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const time = setTimeout(() => {
      setDebouncedQwery(form.search)
    }, 500)
    return () => clearTimeout(time)
  }, [form.search])

  useEffect(() => {
    getAriza(debouncedQwery);
  }, [
    page,
    limit,
    form.status,
    form.startData,
    form.endData,
    debouncedQwery
  ]);

  useEffect(() => {
    setPage(1);
  }, [
    form.status,
    form.startData,
    form.endData,
    debouncedQwery
  ]);
  //RESETFORM
  const resetForm = () => {
    setForm({
      startData: '',
      endData: '',
      status: '',
      search: ""
    });
  };

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

  const changeForm = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem("murojatlar_view_mode") || "card";
  });

  useEffect(() => {
    localStorage.setItem("murojatlar_view_mode", viewMode);
  }, [viewMode]);

  const statusColorScheme = (status) => {
    if (status === "PENDING") return "yellow";
    if (status === "IN_PROGRESS") return "blue";
    if (status === "JEK_COMPLETED" || status === "COMPLETED") return "green";
    if (status === "REJECTED" || status === "JEK_REJECTED") return "red";
    return "gray";
  };


  const calculateDays = (start, end) => {
    if (!start || !end) return null;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = endDate - startDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const rowHoverBg = useColorModeValue("gray.50", "whiteAlpha.50");
  const maxRow = ariza?.length


  return (
    <div>
      <Flex
        my={5}
        alignItems={'center'}
        justifyContent={'space-between'}
        gap={5} bg={cardBg}
        p={5}
        rounded={'16px'}
        backgroundImage={cardGradient}>
        {/* SEARCH */}
        <InputGroup w={'40%'}>
          <InputLeftElement ml={2} w={'25px'} as={Search} />
          <Input
            value={form.search}
            name='search'
            onChange={(e) => changeForm(e)}
            placeholder={t("appeals.searchPlaceholder")}
          />
          {form.search.trim() &&
            < InputRightElement onClick={() => {
              setForm({
                startData: form.startData,
                endData: form.endData,
                status: form.status || null,
                search: ""
              })
              setSearched([])
            }}
              cursor={'pointer'}
              as={X}
              w={5}
              mr={3} />}
        </InputGroup>

        {/* STATUS TANLASH */}
        <Select
          w={'15%'}
          value={form.status}
          name='status'
          onChange={(e) => changeForm(e)}
        >
          {Object.entries(Statuses).map(([value]) => (
            <option key={value} value={value}>{Statuses[value]}</option>
          ))}
        </Select>

        {/* BOSHLANISH SANA */}
        <Input
          w={'25%'}
          value={form.startData}
          name='startData'
          onChange={(e) => changeForm(e)}
          placeholder={t("appeals.startDate")}
          type='date'
        />
        {/* TUGASH SANA */}
        <Input
          w={'25%'}
          value={form.endData}
          name='endData'
          onChange={(e) => changeForm(e)}
          placeholder={t("appeals.endDate")}
          type='date'
        />

        <Button
          w={'20%'}
          variant={'solidPrimary'}
          onClick={resetForm}
        >
          {t("appeals.clearFilters")}
        </Button>

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
      </Flex>

      {/* GETTING TO CARD */}

      {viewMode === 'card' ? (
        <Flex wrap={'wrap'} gap={3}>
          {loading ? (
            <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={3} w="100%">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} h="190px" borderRadius="16px" />
              ))}
            </SimpleGrid>
          ) : (ariza?.length > 0 ?
            ariza.map((item) => {
              return (
                <Box
                  key={item.id}
                  bg={cardBg}
                  backgroundImage={cardGradient}
                  border={cardBorder}
                  borderRadius="16px"
                  px={7}
                  py={4}
                  w={maxRow === 1 || maxRow === 2 ? '49.5%' : '32.5%'}
                  boxShadow={cardShadow}
                  transition="0.2s"
                  _hover={{
                    transform: "translateY(-3px)",
                    boxShadow: cardShadowHover,
                  }}
                >

                  <VStack align={'start'}>
                    <HStack alignItems="center">
                      <Text mb={2} fontWeight="semibold">
                        {item.request_number}
                      </Text>
                      <Text mb={3}>|</Text>
                      <Badge mb={2} colorScheme={statusColorScheme(item.status)}>
                        {Statuses[item?.status] || item?.status}
                      </Badge>
                    </HStack>
                  </VStack>

                  <Flex alignItems="start" justifyContent="space-between">
                    <VStack alignItems="start" spacing={1}>
                      <HStack>
                        <Text>{item?.user?.full_name}</Text>
                        <Text>+{item?.user?.phoneNumber}</Text>
                      </HStack>
                      <Text>{formatDateTime(item.createdAt)}</Text>
                    </VStack>
                  </Flex>
                  <Divider mb={5} mt={5} h="1px" bg="gray.200" opacity={0.6} />
                  <HStack>
                    <Button
                      onClick={() => {
                        navigate(`${item?.id}`)
                      }}
                    >
                      {t("common.view")}
                    </Button>
                  </HStack>
                </Box>
              )
            })
            : (form.search.trim() || ariza.status !== form.status || ariza.createdAt !== form.startData || ariza.completedAt !== form.endData
              ? (

                <Text my={3} mx={'auto'} color="text" fontSize={18}>{t("appeals.notFound")}</Text>
              )
              : ''))}
        </Flex>
      ) :
        <TableContainer
          bg={cardBg}
          border={cardBorder}
          borderRadius="16px"
          boxShadow={cardShadow}
          overflowX="auto"
          backgroundImage={cardGradient}
        >
          <Table size="sm" variant="simple">
            <Thead position="sticky" top={0} bg={cardBg} zIndex={1}>
              <Tr>
                <Th>№</Th>
                <Th>{t("common.status")}</Th>
                <Th>{t("appeals.duration")}</Th>
                <Th>{t("appeals.employee")}</Th>
                <Th>{t("register.phone")}</Th>
                <Th>{t("appeals.table.createdAt")}</Th>
                <Th>{t("common.actions")}</Th>
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
              ) :
                ariza?.length > 0 ? (
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
                          {days !== null
                            ? `${days} ${t("common.day")}`
                            : t("appeals.notFinished")}
                        </Td>

                        <Td>{item?.user?.full_name || "-"}</Td>
                        <Td>+{item?.user?.phoneNumber || "-"}</Td>
                        <Td>{formatDateTime(item.createdAt)}</Td>

                        <Td textAlign="right">
                          <HStack>
                            <Button
                              onClick={() => {
                                navigate(`${item?.id}`)
                              }}
                            >
                              {t("common.view")}
                            </Button>
                          </HStack>
                        </Td>
                      </Tr>
                    );
                  })
                ) : (
                  <Tr>
                    <Td colSpan={9}>
                      <Text my={3} textAlign={'center'} color="text" fontSize={18}>
                        {t("appeals.notFound")}
                      </Text>
                    </Td>
                  </Tr>
                )}
            </Tbody>
          </Table>
        </TableContainer>
      }

      {/*PAGINATION */}
      {totalPages > 0 ? (
        <Flex mb={10} mt={5} justifyContent="center" alignItems="center" gap={3}>
          <Button
            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
            isDisabled={page === 1}
          >
            <ChevronLeft />
          </Button>

          <Text>
            {page} / {totalPages || 1}
          </Text>

          <Button
            onClick={() =>
              setPage(prev => Math.min(prev + 1, totalPages || 1))
            }
            isDisabled={page === totalPages || totalPages === 0}
          >
            <ChevronRight />
          </Button>
        </Flex>
      )
        :
        (
          ''
        )}
    </div >
  )
}