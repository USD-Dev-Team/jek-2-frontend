import {
    Box,
    Divider,
    Flex,
    HStack,
    Image,
    Text,
    useColorModeValue,
    VStack,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Badge,
    Button,
    ModalFooter,
    ModalHeader,
    Icon,
    Input,
    Textarea,
    Skeleton
} from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'
import Cookies from 'js-cookie'
import { useParams } from 'react-router';
import { apiAriza } from '../../Services/api/Ariza';
import { formatDateTime } from '../../utils/tools/formatDateTime';
import { IMAGE_URL } from '../../constants/imageUrl';
import { useTranslation } from 'react-i18next';
import { UploadCloud } from 'lucide-react';

export default function Muammolar() {
    const { id } = useParams()
    const { t } = useTranslation();

    //UI states
    const { isOpen, onOpen, onClose } = useDisclosure();
    const pendingModal = useDisclosure()
    const tugatishModal = useDisclosure()

    const [save, setSave] = useState(false)
    const [loading, setLoading] = useState(false)
    const [problem, setProblem] = useState(null)
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [image, setImage] = useState(null);
    const [comment, setComment] = useState("")

    const fileRef = useRef();
    const role = Cookies.get('role')
    const notAllowed = ['INSPECTION', 'GOVERNMENT'].includes(role)


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
    const Statuses = {
        '': t("appeals.statusAll"),
        PENDING: t("appeals.status_pending"),
        IN_PROGRESS: t("appeals.status_in_progress"),
        COMPLETED: t("appeals.status_completed_user"),
        REJECTED: t("appeals.status_rejected_user"),
        JEK_REJECTED: t("appeals.status_rejected"),
        JEK_COMPLETED: t("appeals.status_completed"),
    };

    //Functional
    const muammo = async () => {
        setLoading(true)
        try {
            const res = await apiAriza.Muammo(id)
            setProblem(res.data.data)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (id) {
            muammo()
        }
    }, [])


    //Kutilmoqda
    const Kutilmoqda = async () => {
        try {
            setSave(true)
            const res = await apiAriza.Kutilmoqda(id)
            muammo()
            pendingModal.onClose()
        } finally {
            setSave(false)
        }
    }

    //Tugatildi
    const Tugatildi = async () => {
        try {
            setSave(true);
            await apiAriza.Tugatildi(id, comment, selectedFile);

            tugatishModal.onClose();

            muammo();
            setComment("");
            setSelectedFile(null);
            setImage(null);
            if (fileRef.current) fileRef.current.value = "";
        } finally {
            setSave(false);
        }
    };

    //handleFIle
    const handleFile = (file) => {
        if (!file) return;
        setSelectedFile(file);
        setImage(URL.createObjectURL(file));
    };

    function formatPhone(phone) {
        if (!phone) return ""
        const digits = phone.replace(/\D/g, "")
        if (digits.length !== 12) return phone
        return `+${digits.slice(0, 3)} ${digits.slice(3, 5)}-${digits.slice(5, 8)}-${digits.slice(8, 10)}-${digits.slice(10, 12)}`
    }

    const statusColorScheme = (status) => {
        if (status === "PENDING") return "yellow";
        if (status === "IN_PROGRESS") return "blue";
        if (status === "JEK_COMPLETED" || status === "COMPLETED") return "green";
        if (status === "REJECTED" || status === "JEK_REJECTED") return "red";
        return "gray";
    };

    const messages = [
        ...(problem?.history_notes?.USER || []).map(m => ({
            ...m,
            type: "USER"
        })),
        ...(problem?.history_notes?.JEK || []).map(m => ({
            ...m,
            type: "JEK"
        })),
    ].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));



    // RENDER
    return (
        <Flex direction={'column'} mb={10}>
            {loading ? (
                <Skeleton rounded={'16px'} mt={5} w={'100%'} h={'500px'} />
            ) : (
                <Flex
                    bg={cardBg}
                    backgroundImage={cardGradient}
                    border={cardBorder}
                    borderRadius="16px"
                    px={7}
                    py={4}
                    mt={5}
                    w={'100%'}
                    boxShadow={cardShadow}
                    transition="0.2s"
                    _hover={{
                        transform: "translateY(-3px)",
                        boxShadow: cardShadowHover,
                    }}
                    direction={'column'}
                    mb={4}
                >
                    <Flex pb={10} w={'100%'} alignItems={'start'} justifyContent={'space-between'}>
                        <VStack w={'100%'} align={'start'} gap={1}>
                            <span style={{ color: '#778092', fontWeight: 'bold' }}>
                                {t("appeals.applicant")}
                            </span>                        <Text>{problem?.user?.full_name}</Text>
                            <Text>{formatPhone(problem?.user?.phoneNumber)}</Text>
                            <Divider w={'300px'} my={3} />
                            <span style={{ color: '#778092', fontWeight: 'bold' }}>
                                {t("appeals.area")}
                            </span>
                            <Text>{problem?.address?.district} , {problem?.address?.neighborhood}</Text>
                            <Text>
                                <span style={{ color: '#778092' }}>
                                    {t("appeals.buildingNumber")}:
                                </span>{" "}
                                {problem?.address?.building_number}
                            </Text>
                            <Text>
                                <span style={{ color: '#778092' }}>
                                    {t("appeals.apartmentNumber")}:
                                </span>{" "}
                                {problem?.address?.apartment_number}
                            </Text>                    </VStack>
                        <VStack w={'100%'} align={'start'} gap={1}>
                            <span style={{ color: '#778092', fontWeight: 'bold' }}>{t("appeals.employee")}</span>
                            <Text>{problem?.assigned_jek?.first_name === null ? 'Hodim biriktirlmagan' : <>{problem?.assigned_jek?.first_name} {problem?.assigned_jek?.last_name}</>} </Text>
                            <Divider w={'300px'} mt={10} mb={3} />
                            <span style={{ color: '#778092', fontWeight: 'bold' }}>{t("appeals.view.startedAt")}</span>
                            <Text>{formatDateTime(problem?.createdAt)}</Text>
                            {
                                problem?.completedAt && <>
                                    <span style={{ color: '#778092', fontWeight: 'bold' }}>{t("appeals.view.endedAt")}</span>
                                    <Text>{formatDateTime(problem?.completedAt)}</Text>
                                </>
                            }




                        </VStack>
                        <VStack w={'33%'} align={'start'}>
                            <Text mb={2} fontWeight="semibold">
                                {problem?.request_number}
                            </Text>
                            <Badge mb={2} colorScheme={statusColorScheme(problem?.status)}>
                                {Statuses[problem?.status] || problem?.status}
                            </Badge>
                            {notAllowed ? '' : <>
                                {
                                    problem?.status === 'PENDING' &&
                                    <Button
                                        bg={'yellow.500'}
                                        _hover={{ bg: 'yellow.600' }}
                                        onClick={() => pendingModal.onOpen()}
                                    >
                                        {t("common.startWork")}
                                    </Button>
                                }
                                {
                                    problem?.status === 'IN_PROGRESS' &&
                                    <Button
                                        bg={'blue.600'}
                                        _hover={{ bg: "blue.800" }}
                                        onClick={() => tugatishModal.onOpen()}
                                    >
                                        {t("common.finish")}
                                    </Button>
                                }
                                {
                                    problem?.status === 'JEK_COMPLETED' &&
                                    <Text>
                                        Foyd. tomondan kutilmoqda
                                    </Text>
                                }
                                {
                                    problem?.status === 'REJECTED' &&
                                    <Button
                                        bg={'red.500'}
                                        _hover={{ bg: "red.800" }}
                                        onClick={() => pendingModal.onOpen()}
                                    >
                                        {t("appeals.review")}
                                    </Button>
                                }</>}

                        </VStack>

                    </Flex>
                    <Divider mb={10} />
                    <Box
                        flex="1"
                        overflowX="auto"
                        overflowY="hidden"
                        pb="2"
                        flexShrink={0}
                        bg="transparent"

                    >
                        <HStack spacing={3} align="stretch" w="max-content" gap={4}>
                            {problem?.requestPhotos?.length ? (
                                problem.requestPhotos.map((r) => (
                                    <Image
                                        w={200}
                                        h={200}
                                        cursor="pointer"
                                        borderRight={2}
                                        borderRightColor={'gray.300'}
                                        borderRadius="lg"
                                        objectFit="contain"
                                        src={r?.file_url ? `${IMAGE_URL}${r.file_url}` : "/no-image.png"}
                                        alt={t("appeals.photo")}
                                        onClick={() => {
                                            setSelectedImage(r?.file_url ? `${IMAGE_URL}${r.file_url}` : "/no-image.png");
                                            onOpen();
                                        }}
                                    />
                                ))
                            ) : (
                                <Text color={'#778092'} fontWeight='bold' >{t("appeals.noPhoto")}</Text>
                            )}
                        </HStack>
                    </Box>
                    <Divider mb={10} />
                    <Flex align={'start'} direction={'column'} gap={50}>
                        <VStack align={'start'}>
                            <span style={{ color: '#778092', fontWeight: 'bold' }}>{t("appeals.userLetter")}</span>
                            <Text>{problem?.description}</Text>
                        </VStack>
                        {
                            problem?.note && <>
                                <VStack align={'start'}>
                                    <span style={{ color: '#778092', fontWeight: 'bold' }}>{t("appeals.jekNote")}</span>
                                    <Text>{problem?.note}</Text>
                                </VStack>
                            </>
                        }

                    </Flex>
                </Flex>)}

            {/* IMAGE MODAL */}
            <Modal isOpen={isOpen} onClose={onClose} size="4xl" isCentered>
                <ModalOverlay />
                <ModalContent bg="transparent" boxShadow="none">
                    <ModalCloseButton color="white" />
                    <ModalBody p={0} textAlign="center">
                        <Image
                            src={selectedImage}
                            maxH="90vh"
                            mx="auto"
                            borderRadius="lg"
                        />
                    </ModalBody>
                </ModalContent>
            </Modal>
            {/* PENDING_MODAL */}
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
            {/*MESSENGER */}
            {messages.map((msg, i) => (
                <Flex
                    key={i}
                    justify={msg.type === "USER" ? "start" : "end"}
                    w="100%"
                >
                    <Box
                        bg={cardBg}
                        backgroundImage={cardGradient}
                        border={cardBorder}
                        borderRadius="16px"
                        px={7}
                        py={4}
                        mt={3}
                        boxShadow={cardShadow}
                        transition="0.2s"
                        _hover={{
                            transform: "translateY(-3px)",
                            boxShadow: cardShadowHover,
                        }}
                    >
                        <Text>{msg.note}</Text>
                        <Text fontSize="10px">
                            {formatDateTime(msg.createdAt)}
                        </Text>
                    </Box>
                </Flex>
            ))}

        </Flex >

    )
}
