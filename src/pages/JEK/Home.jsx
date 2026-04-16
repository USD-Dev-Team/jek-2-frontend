import { Box, Button, Flex, Heading, Select } from "@chakra-ui/react";
import { BellDot } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { i18n,t } = useTranslation();

  const changeLang = (e) => {
    const selectedLang = e.target.value; 
    if (selectedLang) i18n.changeLanguage(selectedLang); 
  };

  return (
    <Box mt={3}>
         <Heading>Home , Jek</Heading>   
    </Box>
  );
}