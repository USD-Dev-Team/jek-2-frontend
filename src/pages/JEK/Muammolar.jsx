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
        <Flex direction="column" gap={6} mb={10}>
            {/* HEADER CARD */}
            <Box
                mt={5}
                bg={cardBg}
                border={cardBorder}
                borderRadius="20px"
                p={6}
                boxShadow={cardShadow}
                _hover={{
                    transform: "translateY(-3px)",
                    boxShadow: cardShadowHover,
                }}
                backgroundImage={cardGradient}
                transition="0.2s"
            >
                <Flex justify="space-between" align="start" wrap="wrap" gap={6}>
                    {/* LEFT INFO */}
                    <VStack align="start" spacing={3}>
                        <Text fontSize="lg" fontWeight="bold">
                            {problem?.request_number}
                        </Text>

                        <Badge
                            fontSize="0.9em"
                            rounded={'10px'}
                            px={3}
                            py={1}
                            colorScheme={statusColorScheme(problem?.status)}
                        >
                            {Statuses[problem?.status] || problem?.status}
                        </Badge>

                        {/* ACTIONS */}
                        {!notAllowed && (
                            <HStack spacing={3} pt={3} flexWrap="wrap">
                                {problem?.status === "PENDING" && (
                                    <Button
                                        size="sm"
                                        bg="yellow.500"
                                        rounded={'10px'}
                                        px={5}
                                        onClick={pendingModal.onOpen}
                                        _hover={{ transform: "translateY(-2px)", bg: 'yellow.700' }}
                                    >
                                        {t("common.startWork")}
                                    </Button>
                                )}

                                {problem?.status === "IN_PROGRESS" && (
                                    <Button
                                        size="sm"
                                        bg='blue.500'
                                        rounded={'10px'}
                                        px={5}
                                        onClick={tugatishModal.onOpen}
                                        _hover={{ transform: "translateY(-2px)", bg: 'blue.700' }}
                                    >
                                        {t("common.finish")}
                                    </Button>
                                )}

                                {problem?.status === "REJECTED" && (
                                    <Button
                                        size="sm"
                                        bg="red.500"
                                        rounded={'10px'}

                                        px={5}
                                        onClick={Kutilmoqda}
                                        _hover={{ transform: "translateY(-2px)", bg: 'red.700' }}
                                    >
                                        {t("appeals.review")}
                                    </Button>
                                )}

                                {problem?.status === "JEK_COMPLETED" && (
                                    <Badge
                                        colorScheme="purple"
                                        rounded={'10px'}

                                        px={4}
                                        py={1}
                                        fontSize="0.8em"
                                    >
                                        {t('appeals.waitingUser')}
                                    </Badge>
                                )}
                            </HStack>
                        )}

                        <Divider />

                        <Box>
                            <Text fontSize="sm" opacity={0.7}>
                                {t("appeals.applicant")}
                            </Text>
                            <Text fontWeight="semibold">
                                {problem?.user?.full_name}
                            </Text>
                            <Text fontSize="sm" opacity={0.7}>
                                {formatPhone(problem?.user?.phoneNumber)}
                            </Text>
                        </Box>

                        <Box>
                            <Text fontSize="sm">
                                {problem?.address?.district}, {problem?.address?.neighborhood}
                            </Text>
                            <Text fontSize="sm" opacity={0.7}>
                                {t("appeals.buildingNumber")}:{" "}
                                {problem?.address?.building_number}
                            </Text>
                            <Text fontSize="sm" opacity={0.7}>
                                {t("appeals.apartmentNumber")}:{" "}
                                {problem?.address?.apartment_number}
                            </Text>
                        </Box>
                    </VStack>

                    {/* RIGHT INFO */}
                    <VStack align="start" spacing={3}>
                        <Box>
                            <Text fontSize="sm" opacity={0.7}>
                                {t("appeals.employee")}
                            </Text>
                            <Text>
                                {problem?.assigned_jek
                                    ? `${problem?.assigned_jek?.first_name} ${problem?.assigned_jek?.last_name}`
                                    : "Biriktirilmagan"}
                            </Text>
                        </Box>

                        <Box>
                            <Text fontSize="sm" opacity={0.7}>
                                {t("appeals.view.startedAt")}
                            </Text>
                            <Text>{formatDateTime(problem?.createdAt)}</Text>
                        </Box>

                        {problem?.completedAt && (
                            <Box>
                                <Text fontSize="sm" opacity={0.7}>
                                    {t("appeals.view.endedAt")}
                                </Text>
                                <Text>{formatDateTime(problem?.completedAt)}</Text>
                            </Box>
                        )}
                    </VStack>
                </Flex>
            </Box>

            {/* GALLERY */}
            <Box>
                <Text mb={3} fontWeight="bold">
                    {t("appeals.photo")}
                </Text>

                <Flex gap={4} wrap="wrap">
                    {problem?.requestPhotos?.length ? (
                        problem.requestPhotos.map((r, i) => (
                            <Box
                                key={i}
                                w="160px"
                                h="160px"
                                borderRadius="16px"
                                overflow="hidden"
                                cursor="pointer"
                                boxShadow="md"
                                _hover={{ transform: "scale(1.05)" }}
                                transition="0.2s"
                                onClick={() => {
                                    setSelectedImage(
                                        r?.file_url
                                            ? `${IMAGE_URL}${r.file_url}`
                                            : "/no-image.png"
                                    );
                                    onOpen();
                                }}
                            >
                                <Image
                                    w="100%"
                                    h="100%"
                                    objectFit="cover"
                                    src={
                                        r?.file_url
                                            ? `${IMAGE_URL}${r.file_url}`
                                            : "/no-image.png"
                                    }
                                />
                            </Box>
                        ))
                    ) : (
                        <Text opacity={0.6}>{t("appeals.noPhoto")}</Text>
                    )}
                </Flex>
            </Box>

            {/* DESCRIPTION */}
            <Box
                bg={cardBg}
                border={cardBorder}
                borderRadius="20px"
                p={6}
                boxShadow={cardShadow}
                transition="0.2s"
                _hover={{
                    transform: "translateY(-3px)",
                    boxShadow: cardShadowHover,
                }}
                backgroundImage={cardGradient}
            >
                <Text fontWeight="bold" mb={2}>
                    {t("appeals.userLetter")}
                </Text>
                <Text mb={4}>{problem?.description}</Text>

                {problem?.note && (
                    <>
                        <Divider my={4} />
                        <Text fontWeight="bold" mb={2}>
                            {t("appeals.jekNote")}
                        </Text>
                        <Text>{problem?.note}</Text>
                    </>
                )}
            </Box>

            {/* CHAT */}
            <Box>
                <Text fontWeight="bold" mb={4}>
                    {t('appeals.chatHistory')}
                </Text>

                <VStack spacing={4} align="stretch">
                    {messages.map((msg, i) => {
                        const isUser = msg.type === "USER";

                        return (
                            <Flex
                                key={i}
                                justify={isUser ? "flex-start" : "flex-end"}
                            >
                                <Box
                                    maxW="70%"
                                    px={4}
                                    py={3}
                                    borderRadius="18px"
                                    bg={isUser ? "gray.100" : "blue.500"}
                                    color={isUser ? "black" : "white"}
                                    boxShadow="md"
                                >
                                    <Text fontSize="sm">{msg.note}</Text>
                                    <Text
                                        fontSize="10px"
                                        opacity={0.7}
                                        mt={1}
                                        textAlign="right"
                                    >
                                        {formatDateTime(msg.createdAt)}
                                    </Text>
                                </Box>
                            </Flex>
                        );
                    })}
                </VStack>
            </Box>

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

            {/*PENDING MODAL */}
            <Modal isOpen={pendingModal.isOpen} onClose={pendingModal.onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{t("appeals.pendingAsk")}</ModalHeader>
                    <ModalCloseButton />
                    <ModalFooter>
                        <Button mr={3} onClick={pendingModal.onClose}>
                            {t("common.cancel")}
                        </Button>
                        <Button
                            colorScheme="yellow"
                            onClick={Kutilmoqda}
                            isLoading={save}
                        >
                            {t("common.yesStart")}
                        </Button>
                    </ModalFooter>

                </ModalContent>
            </Modal>
            {/*TUGATISH MODAL */}
            <Modal
                isOpen={tugatishModal.isOpen}
                onClose={tugatishModal.onClose}
                isCentered
                size="lg"
            >
                <ModalOverlay />
                <ModalContent borderRadius="2xl">
                    <ModalHeader fontWeight="bold">
                        {t("appeals.finishTitle")}
                    </ModalHeader>
                    <ModalCloseButton />

                    <ModalBody>
                        <VStack spacing={5}>
                            {/* DROP AREA */}
                            <Box
                                w="100%"
                                p={6}
                                border="2px dashed"
                                borderColor="gray.300"
                                borderRadius="xl"
                                textAlign="center"
                                cursor="pointer"
                                transition="0.2s"
                                _hover={{ bg: "surface", borderColor: "blue.400s" }}
                                onClick={() => fileRef.current.click()}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    handleFile(e.dataTransfer.files[0]);
                                }}
                                onDragOver={(e) => e.preventDefault()}
                            >
                                {image ? (
                                    <VStack spacing={3}>
                                        <Image
                                            src={image}
                                            maxH="200px"
                                            borderRadius="lg"
                                        />
                                        <Text fontSize="sm" color="green.500">
                                            Rasm yuklandi ✅
                                        </Text>
                                    </VStack>
                                ) : (
                                    <VStack spacing={2}>
                                        <Icon as={UploadCloud} boxSize={10} color="gray.400" />
                                        <Text fontWeight="medium">
                                            Rasmni shu yerga tashlang
                                        </Text>
                                        <Text fontSize="sm" color="gray.500">
                                            yoki tanlash uchun bosing
                                        </Text>
                                    </VStack>
                                )}

                                <Input
                                    type="file"
                                    hidden
                                    ref={fileRef}
                                    accept="image/*"
                                    onChange={(e) => handleFile(e.target.files?.[0])}
                                />
                            </Box>

                            {/* COMMENT */}
                            <Box w="100%">
                                <Text mb={2} fontWeight="medium">
                                    {t("appeals.commentLabel")}
                                </Text>
                                <Textarea
                                    placeholder={t("appeals.commentPlaceholder")}
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    resize="none"
                                />
                                <Text fontSize="xs" color="gray.400" mt={1}>
                                    {comment.length}/20 minimal
                                </Text>
                            </Box>
                        </VStack>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            variant="outline"
                            mr={3}
                            onClick={tugatishModal.onClose}
                        >
                            {t("common.cancel")}
                        </Button>

                        <Button
                            colorScheme="blue"
                            onClick={Tugatildi}
                            isLoading={save}
                            isDisabled={comment.length < 20 || !selectedFile}
                        >
                            {t("common.confirm")}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Flex>
    );
}
