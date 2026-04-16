import { Badge, Box, Button, Checkbox, Divider, Flex, Heading, HStack, Icon, Image, Input, InputGroup, InputLeftElement, InputRightElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Skeleton, Text, Textarea, useDisclosure, VStack } from '@chakra-ui/react'
import { Search, Trash2, UploadCloud, X } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { apiAriza } from '../../Services/api/Ariza'
import { formatDateTime } from '../../utils/tools/formatDateTime'
import adress from "../../constants/mahallas.json";
import { useTranslation } from "react-i18next";
import { apiJekData } from '../../Services/api/Jekdata'
import { IMAGE_URL } from '../../constants/imageUrl'


// const fakeData = [
//   {
//     id: "MRJ-001",
//     name: "Ali Valiyev",
//     phone: "+998901234567",
//     status: "pending",
//     startData: '01.01.2026',
//     endData: '02.02.2026'
//   },
//   {
//     id: "MRJ-002",
//     name: "Vali Karimov",
//     phone: "+998991112233",
//     status: "in_progress",
//     startData: '02.02.2026',
//     endData: '03.03.2026'
//   },
//   {
//     id: "MRJ-002",
//     name: "Vali Karimov",
//     phone: "+998991112233",
//     status: "completed",
//     startData: '02.02.2026',
//     endData: '03.03.2026'
//   },
//   {
//     id: "MRJ-002",
//     name: "Vali Karimov",
//     phone: "+998991112233",
//     status: "rejected",
//     startData: '02.02.2026',
//     endData: '03.03.2026'
//   },
// ]

export default function Murojatlar() {
  const { t, i18n } = useTranslation();

  const lang = i18n.language || "uz";
  const addressData = adress?.[lang] ?? adress?.uz;
  const tuman = addressData?.addresses ?? [];
  const mahalla = addressData?.mahallas ?? {};


  const Statuses = {
    '': t("appeals.statusAll"),
    PENDING: t("appeals.status_pending"),
    IN_PROGRESS: t("appeals.status_in_progress"),
    COMPLETED: t("appeals.status_completed_user"),
    REJECTED: t("appeals.status_rejected_user"),
    JEK_REJECTED: t("appeals.status_rejected"),
    JEK_COMPLETED: t("appeals.status_completed"),
  };
  const korishModal = useDisclosure()

  //UI states
  const [debouncedQwery, setDebouncedQwery] = useState('')

  const [jek, setJek] = useState([])

  const [loading, setLoading] = useState(false)
  const [ariza, setAriza] = useState([])
  const [korish, setKorish] = useState(null)

  //UX states
  const [form, setForm] = useState({
    startData: new Date().toISOString().split("T")[0],
    endData: new Date().toISOString().split("T")[0],
    status: '' || null,
    search: "",
    tuman: '',
    mahalla: ''
  })

  //getJek
  const getJek = async () => {
    try {
      setLoading(true)
      const res = await apiJekData.getAll()
      setJek(res.data.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getJek()
  }, [])

  //getAriza
  const getAriza = async (text) => {
    try {
      setLoading(true)
      const res = await apiAriza.getFilteredRequest(
        form.startData,
        form.endData,
        form.tuman,
        form.mahalla,
        form.status,
        text,

      )
      setAriza(res.data)
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
  }, [form.startData, form.endData, form.tuman,
  form.mahalla, form.status, debouncedQwery])


  //CalculateDays
  const calculateDays = (start, end) => {
    if (!start || !end) return null

    const startDate = new Date(start)
    const endDate = new Date(end)

    const diffTime = endDate - startDate
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return diffDays
  }

  //openKorishModal
  const openKorishModal = (item) => {
    const needAriza = ariza.find((i) => i.id === item.id)
    setKorish(needAriza)
    korishModal.onOpen()
  }


  //RESETFORM
  const resetForm = () => {
    setForm({
      startData: new Date().toISOString().split("T")[0],
      endData: new Date().toISOString().split("T")[0],
      status: '',
      search: "",
      tuman: '',
      mahalla: ''
    });
  };

  const changeForm = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  return (
    <div>
      {/*FILTERS */}
      <Flex mb={4} alignItems={'center'} justifyContent={'space-between'} gap={5}>
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
            }}
              cursor={'pointer'}
              as={X}
              w={5}
              mr={3} />}
        </InputGroup>
        <Select
          w={'15%'}
          value={form.tuman}
          name='tuman'
          onChange={(e) => changeForm(e)}
        >
          <option value={''}>Hammasi</option>
          {tuman.map((tumanName) => (
            <option key={tumanName} value={tumanName}>
              {tumanName}
            </option>
          ))}


        </Select>
        <Select
          w={'15%'}
          value={form.mahalla}
          name='mahalla'
          onChange={(e) => changeForm(e)}
        >
          <option value={''}>Hammasi</option>
          {(mahalla?.[form.tuman] ?? []).map((m) => (
            <option value={m} key={m}>
              {m}
            </option>
          ))}


        </Select>

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
        {/* TRASH */}
        <Button
          w={'25%'}
          variant={'solidPrimary'}
          onClick={resetForm}
        >
          Filterlarni tozalash
        </Button>
      </Flex>

      {/* GETTING TO CARD */}
      <Flex flexDirection={'column'} gap={3}>
        {loading ? (
          <Flex direction={'column'} gap={3}>
            {[1, 2, 3, 4, 5, 6].map((e) => {
              return (
                <Skeleton key={e} h={'130px'} w="100%" rounded={10} />

              )
            })}
          </Flex>
        ) :
          ariza?.length > 0 ?
            ariza.map((item) => {
              const hodim = jek.find(j => j.id === item.assigned_jek_id)
              const days = calculateDays(item.createdAt, item.completedAt)

              return (
                <Box key={item.id} bg={'surface'} rounded={10} px={7} py={4} color={'text'}>
                  <Flex align={'start'} justify={'space-between'}>
                    <HStack alignItems={'center'}>
                      <Text mb={2} fontWeight={'semibold'}>{item.request_number}</Text>
                      <Text mb={3}>|</Text>
                      <Badge
                        mb={2}
                        colorScheme={
                          item.status === 'PENDING' ? 'yellow'
                            : item.status === 'IN_PROGRESS' ? 'blue'
                              : item.status === 'JEK_COMPLETED' ? 'green'
                                : item.status === 'COMPLETED' ? 'green'
                                  : item.status === 'REJECTED' ? 'red'
                                    : 'gray'
                        }
                      >
                        {Statuses[item?.status]}
                      </Badge>
                    </HStack>
                    <VStack align={'end'}>
                      <Text fontWeight={'bold'}>
                        <span style={{ fontWeight: 'normal' }}>Hodim:</span> {hodim ? `${hodim.first_name} ${hodim.last_name}` : 'Topilmadi'}
                      </Text>
                      <Text fontWeight={'bold'}>
                        <span style={{ fontWeight: 'normal' }}>Davomiylig:</span> {days !== null ? `${days} kun` : 'Tugamagan'}
                      </Text>
                      <Text fontWeight={'bold'}>
                        <span style={{ fontWeight: 'normal' }}>Hudud:</span> {`${item?.address?.district} , ${item?.address?.neighborhood}`}
                      </Text>

                    </VStack>
                  </Flex>

                  <Divider mb={2} orientation='horizontal' h={'px'} bg={'netural.500'} />

                  <Flex alignItems={'start'} justifyContent={'space-between'}>
                    <VStack alignItems={'start'}>
                      <HStack>
                        <Text>{item?.user?.full_name}</Text>
                        <Text>+{item?.user?.phoneNumber}</Text>
                      </HStack>
                      <Text>{formatDateTime(item.createdAt)}</Text>
                    </VStack>

                    <HStack>
                      <HStack>
                        <Button
                          onClick={() => {
                            openKorishModal(item)
                          }}
                        >
                          {t("common.view")}
                        </Button>
                      </HStack>
                    </HStack>
                  </Flex>
                </Box>
              )
            })
            : (form.search.trim() || ariza.status !== form.status || ariza.createdAt !== form.startData || ariza.completedAt !== form.endData
              ? <Text color={'red'} fontSize={22}>{t("appeals.notFound")}</Text>
              : '')
        }
      </Flex>

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
              <span style={{ color: '#778092' }}>{t("appeals.view.endedAt")} :</span> {formatDateTime(korish?.completedAt) === '-' || null ? 'Tugamagan' : formatDateTime(korish?.completedAt)}
            </Text>

            <Divider mb={4} mt={6} bg='white' />

            <Text mb={2} fontWeight={'bold'}>
              <span style={{ color: '#778092' }}>{t("appeals.view.note")} :</span> {korish?.note === null || '' ? 'Izoh yoq' : korish?.note}
            </Text>
            <Divider mb={4} mt={6} bg='white' />

            <Flex gap={4}>
              <Text fontWeight={'bold'} color='#778092' >Rasm : </Text>
              <Box
                border="2px dashed"
                borderColor="gray.300"
                borderRadius="xl"
                p={3}>
                <Image
                  borderRadius={'lg'}
                  w={150}
                  src={korish?.requestPhotos?.length
                    ? `${IMAGE_URL}${korish.requestPhotos[0].file_url}`
                    : "/no-image.png"
                  }
                  alt={korish?.requestPhotos?.length ? 'rasm' : 'rasm yo\'q'}
                />
              </Box>

            </Flex>

          </ModalBody>
          <ModalFooter>
            <Button onClick={() => korishModal.onClose()} variant={'outlinePrimary'}>
              {t("common.close")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div >
  )
}