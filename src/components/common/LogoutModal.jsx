import { useState } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { LucideLogOut } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useTranslation } from "react-i18next";


export default function LogoutModal() {
      const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
  };

  return (
    <>
      {/* Trigger Button (xs kiyin istalgan joyga bosib qo'ying) */}
      <Button
        cursor="pointer"
        padding={"0px"}
        bg="surface"
        color={"text"}
        _hover={{ bg: "red.300", color: "red" }}
        onClick={onOpen}
      >
        <LucideLogOut size={20} />
      </Button>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(6px)" />
        <ModalContent>
          <ModalHeader>{t("logout.title")}</ModalHeader>

          <ModalBody>
            <Text>{t("logout.text")}</Text>
          </ModalBody>

          <ModalFooter gap={3}>
            <Button  variant="ghost" onClick={onClose}>
              {t("logout.cancel")}
            </Button>
            <Button  colorScheme="red" onClick={handleLogout}>
              {t("logout.confirm")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
