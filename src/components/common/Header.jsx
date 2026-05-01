import {

  Flex,

  HStack,

  IconButton,

  Select,

  useBreakpointValue,

} from "@chakra-ui/react";

import { BellDot, Menu } from "lucide-react";

import { useMemo } from "react";

import { useTranslation } from "react-i18next";

import { useUIStore } from "../../store/useUIStore";

import Breadcumb from "../ui/Breadcumb";

export default function Header() {

  const { collapsed } = useUIStore();

  const toggleSidebar = useUIStore((s) => s.toggleSidebar);

  const { t, i18n } = useTranslation();

  const isMobile = useBreakpointValue({ base: true, md: false });

  const currentLang = (i18n.resolvedLanguage || i18n.language || "uz").split("-")[0];

  const langOptions = useMemo(

    () => [

      { value: "uz", label: t("common.languages.uz") },

      { value: "en", label: t("common.languages.en") },

      { value: "ru", label: t("common.languages.ru") },

    ],

    [i18n.language]

  );

  return (

    <Flex

      position="fixed"

      top="0"

      left={isMobile ? "0" : collapsed ? "70px" : "240px"}

      right="0"

      bg="darkblue"

      h={{base:"50px", md:"70px"}}

      px={4}

      align="center"

      justify="space-between"

      zIndex="1000"

      color="text"

      transition="all 0.3s ease"

    >

      <HStack gap={3}>

        {isMobile && (

          <IconButton

            icon={<Menu size={20} />}

            onClick={toggleSidebar}

  

            color="white"

            aria-label="menu"

          />

        )}

        <Breadcumb />

      </HStack>

      <HStack gap={4}>

        <Select

          value={currentLang}

          onChange={(e) => i18n.changeLanguage(e.target.value)}

          size="sm"

          w="120px"

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