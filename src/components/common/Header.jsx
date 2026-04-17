import { Flex, HStack, IconButton, Select } from "@chakra-ui/react";
import { BellDot } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { useUIStore } from "../../store/useUIStore";
import Breadcumb from "../ui/Breadcumb";

export default function Header() {
  const { collapsed } = useUIStore();
  const { t, i18n } = useTranslation();

  // "en-US" bo‘lib ketsa ham "en" qilib olamiz
  const currentLang = (i18n.resolvedLanguage || i18n.language || "uz").split("-")[0];

  const langOptions = useMemo(
    () => [
      { value: "uz", label: t("common.languages.uz") },
      { value: "en", label: t("common.languages.en") },
      { value: "ru", label: t("common.languages.ru") },
    ],
    [i18n.language] // til o‘zgarsa option label ham yangilansin
  );

  const handleLangChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <Flex
      position="fixed"
      top="0"
      left={collapsed ? "70px" : "220px"}
      transition="0.25s ease"
      boxShadow="lg"
      right="0"
      bg="darkblue"
      h="70px"
      px={6}
      align="center"
      justify="space-between"
      zIndex="1000"
      color="text"
    >
      <Breadcumb />

      <HStack gap={5}>
        

        <Select
          value={currentLang}
          onChange={handleLangChange}
          size="sm"
          w="140px"
          bg="surface"
        >
          {langOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
      </HStack>
    </Flex>
  );
}