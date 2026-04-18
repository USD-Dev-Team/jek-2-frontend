import { Badge, Box, Button, ButtonGroup, Checkbox, Divider, useColorModeValue, Flex, Heading, HStack, Icon, Image, Input, InputGroup, InputLeftElement, InputRightElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Skeleton, Table, TableContainer, Tbody, Td, Text, Textarea, Th, Thead, Tr, useDisclosure, VStack, SimpleGrid } from '@chakra-ui/react'
import { ChevronLeft, ChevronRight, LayoutGrid, Search, Table2, Trash2, UploadCloud, X } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { apiAriza } from '../../Services/api/Ariza'
import { formatDateTime } from '../../utils/tools/formatDateTime'
import { useTranslation } from "react-i18next";
import { IMAGE_URL } from '../../constants/imageUrl'
import Cookies from 'js-cookie'


export default function Murojatlar() {
  const { t } = useTranslation();

  const Statuses = {
    '': t("appeals.statusAll"),
    PENDING: t("appeals.status_pending"),
    IN_PROGRESS: t("appeals.status_in_progress"),
    COMPLETED: t("appeals.status_completed_user"),
    REJECTED: t("appeals.status_rejected_user"),
    JEK_REJECTED: t("appeals.status_rejected"),
    JEK_COMPLETED: t("appeals.status_completed"),
  };

  const pendingModal = useDisclosure()
  const tugatishModal = useDisclosure()
  const korishModal = useDisclosure()

  //UI states
  const [debouncedQwery, setDebouncedQwery] = useState('')
  const [image, setImage] = useState(null);
  const [comment, setComment] = useState("")
  const fileRef = useRef();

  const [loading, setLoading] = useState(false)
  const [ariza, setAriza] = useState([])
  const [save, setSave] = useState(false)
  const [savingAriza, setSavingAriza] = useState(null)
  const [korish, setKorish] = useState(null)

  const [selectedFile, setSelectedFile] = useState(null);

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
        form.startData,
        form.endData,
        // form.startData.value ? form.startData : null,
        // form.endData.value ? form.endData : null,
        Cookies.get('district'),
        Cookies.get('neighborhood'),
        form.status,
        text,
        page - 1,
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
    getAriza(debouncedQwery)
  }, [form.startData, form.endData, form.status, debouncedQwery, page])

  useEffect(() => {
    setPage(1)
  }, [form.status, form.startData, form.endData, debouncedQwery])

  //openPendingModal
  const openPendingModal = (item) => {
    korishModal.onClose()
    pendingModal.onOpen()
    setSavingAriza(item)
  }

  //Kutilmoqda
  const Kutilmoqda = async () => {
    try {
      setSave(true)
      const res = await apiAriza.Kutilmoqda(savingAriza.id)
      pendingModal.onClose()
      korishModal.onClose()
      getAriza()
      setSavingAriza(null)
    } finally {
      setSave(false)
    }
  }

  //Tugatildi
  const Tugatildi = async () => {
    try {
      setSave(true);
      await apiAriza.Tugatildi(savingAriza.id, comment, selectedFile);

      tugatishModal.onClose();
      setSavingAriza(null);
      getAriza();
      setComment("");
      setSelectedFile(null);
      setImage(null);
      if (fileRef.current) fileRef.current.value = "";
    } finally {
      setSave(false);
    }
  };

  //openKorishModal
  const openKorishModal = (item) => {
    const needAriza = ariza.find((i) => i.id === item.id)
    setKorish(needAriza)
    korishModal.onOpen()
  }

  //handleFIle
  const handleFile = (file) => {
    if (!file) return;
    setSelectedFile(file);
    setImage(URL.createObjectURL(file));
  };

  //RESETFORM
  const resetForm = () => {
    setForm({
      startData: null || '',
      endData: null,
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
                    {item.status === 'PENDING' &&
                      <HStack>
                        <Button
                          onClick={() => openKorishModal(item)}
                          bg={'blue.600'}
                          color='white'
                          _hover={{ bg: 'blue.400' }}
                        >
                          {/* {t("common.startWork")} */}
                          {t("common.view")}
                        </Button>
                      </HStack>
                    }

                    {item.status === 'IN_PROGRESS' &&
                      <HStack>
                        <Button
                          bg={'green.600'}
                          _hover={{ bg: 'green.500' }}
                          onClick={() => {
                            tugatishModal.onOpen()
                            setSavingAriza(item)
                          }}
                          color='white'
                        >
                          {t("common.finish")}
                        </Button>
                      </HStack>
                    }

                    {(item.status === 'JEK_COMPLETED' || item.status === 'COMPLETED' || item.status === 'REJECTED') &&
                      <HStack>
                        <Button
                          onClick={() => {
                            openKorishModal(item)
                          }}
                        >
                          {t("common.view")}
                        </Button>
                      </HStack>
                    }
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

                        <Td>{days !== null ? `${days} kun` : "Tugamagan"}</Td>

                        <Td>{item?.user?.full_name || "-"}</Td>
                        <Td>+{item?.user?.phoneNumber || "-"}</Td>
                        <Td>{formatDateTime(item.createdAt)}</Td>

                        <Td textAlign="right">
                          <HStack>
                            {item.status === 'PENDING' &&
                              <HStack>
                                <Button
                                  onClick={() => openKorishModal(item)}
                                  bg={'blue.600'}
                                  color='white'
                                  _hover={{ bg: 'blue.400' }}
                                >
                                  {/* {t("common.startWork")} */}
                                  {t("common.view")}
                                </Button>
                              </HStack>
                            }

                            {item.status === 'IN_PROGRESS' &&
                              <HStack>
                                <Button
                                  bg={'green.600'}
                                  _hover={{ bg: 'green.500' }}
                                  onClick={() => {
                                    tugatishModal.onOpen()
                                    setSavingAriza(item)
                                  }}
                                  color='white'
                                >
                                  {t("common.finish")}
                                </Button>
                              </HStack>
                            }

                            {(item.status === 'JEK_COMPLETED' || item.status === 'COMPLETED' || item.status === 'REJECTED') &&
                              <HStack>
                                <Button
                                  onClick={() => {
                                    openKorishModal(item)
                                  }}
                                >
                                  {t("common.view")}
                                </Button>
                              </HStack>
                            }
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
            onClick={() => setPage(prev => prev - 1)}
            isDisabled={page === 1}
          >
            <ChevronLeft />
          </Button>

          <Text>
            {page} / {totalPages}
          </Text>

          <Button
            onClick={() => setPage(prev => prev + 1)}
            isDisabled={page === totalPages}
          >
            <ChevronRight />
          </Button>
        </Flex>
      )
        :
        (
      ''
    )}

      {/*PENDING_MODAL */}
      <Modal isOpen={pendingModal.isOpen} onClose={pendingModal.onClose} isCentered>
        <ModalOverlay />
        <ModalContent display={'flex'} alignItems={'center'} flexDirection={'column'} maxW={'25vw'}>
          <ModalBody>
            <Text display={'flex'} alignItems={'start'} gap={2} pt={3}>
              {t("appeals.pendingAsk")}
            </Text>
          </ModalBody>
          <ModalFooter w={'100%'} display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
            <Button onClick={() => pendingModal.onClose()} variant={'outlinePrimary'}>
              {t("common.cancel")}
            </Button>
            <Button variant={'solidPrimary'} onClick={() => Kutilmoqda()}>
              {t("common.yesStart")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/*TUGATISH_MODAL */}
      <Modal isOpen={tugatishModal.isOpen} onClose={tugatishModal.onClose} isCentered size="lg">
        <ModalOverlay />
        <ModalContent borderRadius="2xl">
          <ModalHeader>{t("appeals.finishTitle")}</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <VStack spacing={5}>
              {/* Upload area */}
              <Box
                w="100%"
                p={6}
                border="2px dashed"
                borderColor="gray.300"
                borderRadius="xl"
                textAlign="center"
                cursor="pointer"
                _hover={{ bg: "gray.800" }}
                onClick={() => fileRef.current.click()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleFile(e.dataTransfer.files[0]);
                }}
                onDragOver={(e) => e.preventDefault()}
              >
                {image ? (
                  <Box>
                    <img
                      src={image}
                      alt="preview"
                      style={{
                        maxHeight: "200px",
                        margin: "0 auto",
                        borderRadius: "12px",
                      }}
                    />
                    <Text mt={2} fontSize="sm" color="gray.500">
                      {t("appeals.imageUploaded")}
                    </Text>
                  </Box>
                ) : (
                  <Flex direction="column" align="center" gap={2}>
                    <Icon as={UploadCloud} boxSize={8} color="gray.400" />
                    <Text fontWeight="medium">
                      {t("appeals.uploadDrop")}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      {t("appeals.uploadTypes")}
                    </Text>
                  </Flex>
                )}

                <Input
                  type="file"
                  hidden
                  ref={fileRef}
                  accept="image/*"
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />
              </Box>

              {/* Comment */}
              <Box w="100%">
                <Text mb={2} fontWeight="medium">
                  {t("appeals.commentLabel")} <span style={{ color: 'red' }}>*</span>
                </Text>
                <Textarea
                  placeholder={t("appeals.commentPlaceholder")}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  resize="none"
                />
                <Text fontSize="xs" color="gray.400" mt={1}>
                  {comment.length}/20 {t("common.minimal")}
                </Text>
              </Box>
            </VStack>
          </ModalBody>

          <ModalFooter >
            <Button variant="outlinePrimary" mr={3} onClick={tugatishModal.onClose}>
              {t("common.cancel")}
            </Button>
            <Button
              onClick={Tugatildi}
              isDisabled={comment.length < 20 || !selectedFile}
              variant="solidPrimary"
            >
              {t("common.confirm")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* KORISH_MODAL */}
      <Modal isOpen={korishModal.isOpen} onClose={korishModal.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>
            <Text>{korish?.request_number}</Text>
            <Heading fontSize={'30px'} mb={0}>{korish?.user?.full_name}</Heading>
            <Text fontSize={'17px'} fontWeight={'light'} mb={3}>+{korish?.user?.phoneNumber}</Text>
            <Divider bg='white' />
          </ModalHeader>
          <ModalBody>
            <Text mb={2} fontWeight={'bold'}>
              <span style={{ color: '#778092' }}>{t("appeals.view.status")} :</span>{" "}
              <Badge colorScheme={korish?.status === 'PENDING' ? 'yellow' : korish?.status === 'IN_PROGRESS' ? 'blue' : korish?.status === 'JEK_COMPLETED' ? 'green' : korish?.status === 'COMPLETED' ? 'green' : korish?.status === 'REJECTED' ? 'red' : 'gray'}>
                {Statuses[korish?.status]}
              </Badge>
            </Text>

            <Text mb={2} fontWeight={'bold'}>
              <span style={{ color: '#778092' }}>{t("appeals.view.type")} :</span> {korish?.description}
            </Text>

            <Text mb={2} fontWeight={'bold'}>
              <span style={{ color: '#778092' }}>{t("appeals.view.startedAt")} :</span> {formatDateTime(korish?.createdAt)}
            </Text>

            <Text mb={2} fontWeight={'bold'}>
              <span style={{ color: '#778092' }}>{t("appeals.view.endedAt")} :</span> {formatDateTime(korish?.completedAt)}
            </Text>
            <Divider mb={4} mt={6} bg='white' />
            <Text mb={2} fontWeight={'bold'}>
              <span style={{ color: '#778092' }}>Tuman / Shahar :</span> {korish?.address?.district}
            </Text>
            <Text mb={2} fontWeight={'bold'}>
              <span style={{ color: '#778092' }}>Mahalla :</span> {korish?.address?.neighborhood}
            </Text>
            <Text mb={2} fontWeight={'bold'}>
              <span style={{ color: '#778092' }}>Bino raqami :</span> {korish?.address?.building_number}
            </Text>
            <Text mb={2} fontWeight={'bold'}>
              <span style={{ color: '#778092' }}>Honadon raqami :</span> {korish?.address?.apartment_number}
            </Text>

            <Divider mb={4} mt={6} bg='white' />

            <Text mb={2} fontWeight={'bold'}>
              <span style={{ color: '#778092' }}>{t("appeals.view.note")} :</span> {korish?.note ? korish?.note : 'Tavsif yo\'q'}
            </Text>

            <Divider mb={4} mt={6} bg='white' />

            <Flex gap={4}>
              <Text color='#778092' fontWeight={'bold'} >Rasm(Foyd.):</Text>
              <Box w={'auto'} h={'auto'} p={2} border="2px dashed"
                borderColor="gray.300"
                borderRadius="xl">
                <Image borderRadius={'lg'} w={150} src={korish?.requestPhotos?.length
                  ? `${IMAGE_URL}${korish.requestPhotos[0].file_url}`
                  : "/no-image.png"
                }
                  alt={korish?.requestPhotos?.length > 0 ? 'rasm' : 'rasm yo\'q'} />
              </Box>
            </Flex>
          </ModalBody>
          <ModalFooter display={'flex'} gap={5}>
            <Button onClick={() => korishModal.onClose()} variant={'outlinePrimary'}>
              {t("common.close")}
            </Button>
            <Button onClick={() => korish?.status === 'PENDING' ? openPendingModal(korish) : korishModal.onClose()} variant={'solidPrimary'}>
              {korish?.status === 'PENDING' ? 'Ishni boshlash' : 'Qayta korib chiqish'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>


    </div >
  )
}