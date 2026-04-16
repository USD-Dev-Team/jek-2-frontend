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
  Code,
} from "@chakra-ui/react";
import { ChevronDown, ChevronUp, Search, X } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { apiAriza } from "../../Services/api/Ariza";
import adress from "../../constants/mahallas.json";
import { useTranslation } from "react-i18next";
import { apiJekData } from "../../Services/api/Jekdata";

// const mockEmployees = [
//   {
//     id: 1,
//     first_name: "Ali",
//     last_name: "Valiyev",
//     phone_number: "+998901234567",
//     address: "Toshkent, Chilonzor",
//     is_active: true,
//     last10: [
//       { no: "MRJ-1021", status: "Yakunlangan", endedAt: "2026-02-02T10:20:00Z" },
//     ],
//   },
//   {
//     id: 2,
//     first_name: "Vali",
//     last_name: "Karimov",
//     phone_number: "+998991112233",
//     address: "Toshkent, Yunusobod",
//     is_active: false,
//     last10: [],
//   },
// ];

export default function HodimlarINS() {

  const Statuses = {
    "": 'Hammasi(status)',
    ACTIVE: 'Faol',
    INACTIVE: 'Nofaol',
  };

  const { t, i18n } = useTranslation();

  const lang = i18n.language || "uz";
  const addressData = adress?.[lang] ?? adress?.uz;
  const tuman = addressData?.addresses ?? [];
  const mahalla = addressData?.mahallas ?? {};


  const confirmModal = useDisclosure();
  const [debouncedIsm, setDebouncedIsm] = useState('')
  const [debouncedFamiliya, setDebouncedFamiliya] = useState('')

  const [jekList, setJekList] = useState([]);
  const [jekFilter, setJekFilter] = useState([]);
  const [saving, setSaving] = useState(false)

  const [hodim, setHodim] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  const [selected, setSelected] = useState(null);
  const [nextActiveValue, setNextActiveValue] = useState(null);

  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    ism: '',
    familiya: '',
    tuman: '',
    mahalla: '',
    nomer: '',
    isActive: ''
  })


  // //getJek
  // const getJek = async () => {
  //   try {
  //     setLoading(true)
  //     const res = await apiJekData.getAll()
  //     setJekList(res.data.data)
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  // const jekMap = useMemo(() => {
  //   return Object.fromEntries(
  //     jekList.map(j => [j.id, j])
  //   );
  // }, [jekList]);




  // useEffect(() => {
  //   getJek()

  // }, [])

  //getAriza
  const getAriza = async (ism, familiya) => {
    try {
      setLoading(true)
      const res = await apiJekData.getFilterJek(
        ism,
        familiya,
        form.tuman,
        form.mahalla,
        form.nomer,
        form.isActive

      )
      setHodim(res.data.data)
    } finally {
      setLoading(false)
    }
  }

  const onlyJek = hodim.filter((h) => h.role === 'JEK')



  useEffect(() => {
    const time = setTimeout(() => {
      setDebouncedIsm(form.ism)
      setDebouncedFamiliya(form.familiya)
    }, 500)
    return () => clearTimeout(time)
  }, [form.ism, form.familiya])

  useEffect(() => {
    getAriza(debouncedIsm, debouncedFamiliya)
  }, [form.tuman, form.mahalla, form.nomer, form.isActive, debouncedIsm, debouncedFamiliya])

  //deActivate
  const deActivate = async (value) => {
    const payload = {
      isActive: value.isActive ? false : true
    }

    try {
      setSaving(true)
      await apiJekData.deActivation(value?.id, payload)
      confirmModal.onClose()
      getAriza()


    } finally {
      setSaving(false)
    }
  }

  const openConfirm = (emp, value) => {
    setSelected(emp);
    setNextActiveValue(value);
    confirmModal.onOpen();
  };

  const changeForm = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const resetForm = () => {
    setForm({
      ism: '',
      familiya: '',
      tuman: '',
      mahalla: '',
      nomer: '',
      isActive: ''
    });
  };


  return (
    <Box>
      {/*FILTERS */}
      <Flex mb={4} alignItems={'center'} justifyContent={'space-between'} gap={3}>

        {/* SEARCH */}
        <InputGroup w={'40%'}>
          <Input
            value={form.ism}
            name='ism'
            onChange={(e) => changeForm(e)}
            placeholder={'Ism'}
          />
          {form.ism.trim() &&
            < InputRightElement onClick={() => {
              setForm((prev) => ({ ...prev, ism: '' }))
            }}
              cursor={'pointer'}
              as={X}
              w={5}
              mr={3} />}
        </InputGroup>


        <InputGroup w={'40%'}>
          <Input
            value={form.familiya}
            name='familiya'
            onChange={(e) => changeForm(e)}
            placeholder={'Familiya'}
          />
          {form.familiya.trim() &&
            < InputRightElement onClick={() => {
              setForm((prev) => ({ ...prev, familiya: '' }))
            }}
              cursor={'pointer'}
              as={X}
              w={5}
              mr={3} />}
        </InputGroup>

        {/*HUDUD */}
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
          value={form.isActive}
          name='status'
          onChange={(e) => changeForm(e)}
        >
          {Object.entries(Statuses).map(([value]) => (
            <option key={value} value={value}>{Statuses[value]}</option>
          ))}
        </Select>
        {/* TRASH */}
        <Button
          w={'25%'}
          variant={'solidPrimary'}
          onClick={resetForm}
        >
          Filterlarni tozalash
        </Button>
      </Flex>

      {/* GETIING TO CARD */}
      <Flex direction="column" gap={3}>
        {loading ? (
          <Flex direction={'column'} gap={3}>
            {[1, 2, 3, 4, 5, 6].map((e) => {
              return (
                <Skeleton key={e} h={'130px'} w="100%" rounded={10} />

              )
            })}
          </Flex>
        ) :
          onlyJek.length > 0 ?
            onlyJek.map((emp) => {
              const isExpanded = expandedId === emp.id;
              return (
                <Box key={emp.id} bg="gray.700" p={4} rounded={10}>
                  {/* HEADER */}
                  <Flex justify="space-between" align="center">
                    <HStack>
                      <Heading fontSize="18px">{`${emp?.first_name} ${emp?.last_name}`}</Heading>


                      <Badge colorScheme={emp?.isActive ? "green" : "red"}>
                        {emp?.isActive ? "Faol" : "Faol emas"}
                      </Badge>

                    </HStack>

                    <HStack>
                      {/* TAFSILOT */}
                      <Button
                        size="sm"
                        onClick={() =>
                          setExpandedId(isExpanded ? null : emp.id)
                        }
                        rightIcon={
                          isExpanded ? (
                            <ChevronUp size={16} />
                          ) : (
                            <ChevronDown size={16} />
                          )
                        }
                      >
                        Tafsilotlar
                      </Button>

                      <HStack>
                        <Text>Faol/Faol emas</Text>
                        {/* SWITCH */}
                        <Switch
                          isChecked={emp?.isActive}
                          onChange={(e) =>
                            openConfirm(emp, e.target.checked)
                          }
                        />
                      </HStack>
                    </HStack>
                  </Flex>

                  <Divider my={3} />

                  {/* ASOSIY MALUMOT */}
                  <Text
                    fontWeight={'semibold'}
                  ><span style={{ fontWeight: 'normal' }}>Telefon:</span> +{emp?.phoneNumber}
                  </Text>
                  <Text
                    fontWeight={'semibold'}
                  ><span style={{ fontWeight: 'normal' }}>Hudud:</span> {`${emp?.addresses?.[0]?.address?.district}, ${emp?.addresses?.[0]?.address?.neighborhood}`}
                  </Text>

                  {/* COLLAPSE */}
                  <Collapse in={isExpanded} animateOpacity>
                    <Box mt={3}>
                      <Text fontWeight="bold" mb={2}>
                        So‘nggi buyurtmalar
                      </Text>

                      {/* {emp?.last10?.length ? (
                          emp.last10.map((r, i) => (
                            <Flex
                              key={i}
                              justify="space-between"
                              bg="blackAlpha.300"
                              p={2}
                              rounded={6}
                              mb={2}
                            >
                              <Text>{r.no}</Text>
                              <Badge colorScheme="green">
                                {r.status}
                              </Badge>
                            </Flex>
                          ))
                        ) : (
                          <Text opacity={0.6}>Ma’lumot yo‘q</Text>
                        )} */}
                    </Box>
                  </Collapse>
                </Box>
              );
            }) : (form.ism.trim() || form.familiya.trim() || onlyJek.phoneNumber !== form.number || onlyJek?.addresses?.[0].address?.district !== form.tuman || onlyJek?.addresses?.[0].address?.neighborhood !== form.mahalla
              ? <Text color={'red'} fontSize={22}>{t("appeals.notFound")}</Text>
              : '')
        }
      </Flex>

      {/* MODAL */}
      <Modal isOpen={confirmModal.isOpen} onClose={confirmModal.onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />

          <ModalHeader>
            {nextActiveValue ? "Faollashtirish" : "O‘chirish"}
          </ModalHeader>

          <ModalBody>
            <Text>
              Siz ushbu xodim holatini o‘zgartirmoqchimisiz?
            </Text>

            <Text mt={3}>
              Xodim:{" "}
              <b>
                {selected
                  ? `${selected.first_name} ${selected.last_name}`
                  : "-"}
              </b>
            </Text>
          </ModalBody>

          <ModalFooter gap={3}>
            <Button onClick={confirmModal.onClose}>
              Bekor qilish
            </Button>
            <Button onClick={() => deActivate(selected)} colorScheme="blue">
              Tasdiqlash
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}