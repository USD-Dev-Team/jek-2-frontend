import {
  Box,
  Flex,
  Select,
  SimpleGrid,
  Grid,
  GridItem,
  Heading,
  Text,
  Stack,
  HStack,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
} from "@chakra-ui/react";

import { Doughnut, Line, Bar } from "react-chartjs-2";
import { Check, File, RotateCcw, TriangleAlert } from "lucide-react";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";

import { useState, useMemo } from "react";
import { useColorModeValue } from "@chakra-ui/react";
import adress from "../../constants/mahallas.json";
import { useTranslation } from "react-i18next";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  BarElement,
  Tooltip,
  Legend
);

function useChartColors() {
  return {
    primary: useColorModeValue("#006bb3", "#0088e6"),
    success: useColorModeValue("#38a169", "#48bb78"),
    warning: useColorModeValue("#f0b429", "#f7c948"),
    danger: useColorModeValue("#e53e3e", "#f56565"),
    chartOut: useColorModeValue("#3182ce", "#4299e1"),
    muted: useColorModeValue("#718096", "#a0aec0"),

    successBg: useColorModeValue("rgba(56,161,105,0.12)", "rgba(72,187,120,0.12)"),
    warningBg: useColorModeValue("rgba(240,180,41,0.12)", "rgba(247,201,72,0.12)"),
    dangerBg: useColorModeValue("rgba(229,62,62,0.12)", "rgba(245,101,101,0.12)"),
    infoBg: useColorModeValue("rgba(49,130,206,0.12)", "rgba(66,153,225,0.12)"),
    primaryBg: useColorModeValue("rgba(0,107,179,0.08)", "rgba(0,136,230,0.08)"),

    textMuted: useColorModeValue("#4a5568", "#a0aec0"),
    gridLine: useColorModeValue("rgba(0,0,0,0.06)", "rgba(255,255,255,0.06)"),
    surface: useColorModeValue("#ffffff", "#0B1C26"),
    border: useColorModeValue("#e2e8f0", "#2d3748"),
  };
}

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const c = useChartColors();

  // Tuman value endi INDEX bo'ladi (til o'zgarsa ham mos qoladi)
  const [selectedTumanIdx, setSelectedTumanIdx] = useState(""); // "", "0", "1", ...
  const [dateFrom, setDateFrom] = useState("2026-01-01");
  const [dateTo, setDateTo] = useState("2026-12-31");

  // address data (til bo‘yicha, bo‘lmasa uz)
  const lang = i18n.language || "uz";
  const addressData = adress?.[lang] ?? adress?.uz ?? {};
  const tumans = addressData?.addresses ?? [];

  // Agar sizga tanlangan tumanning hozirgi tildagi nomi kerak bo'lsa:
  const selectedTuman =
    selectedTumanIdx === "" || !Array.isArray(tumans) ? "" : tumans[Number(selectedTumanIdx)];

  const cardShell = {
    bg: c.surface,
    border: `1px solid ${c.border}`,
    borderRadius: "14px",
    p: "16px",
  };

  const baseCartesianOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: c.textMuted, font: { size: 12 }, boxWidth: 10, padding: 12 },
      },
      tooltip: { enabled: true },
    },
    scales: {
      x: {
        ticks: { color: c.textMuted, font: { size: 11 } },
        grid: { color: c.gridLine },
        border: { display: false },
      },
      y: {
        ticks: { color: c.textMuted, font: { size: 11 } },
        grid: { color: c.gridLine },
        border: { display: false },
      },
    },
  };

  const statCards = [
    {
      id: "total",
      label: t("dashboard.totalAppeals"),
      value: 452,
      delta: "+25%",
      deltaColor: c.success,
      icon: <File size={15} />,
      iconBg: c.infoBg,
      iconColor: c.chartOut,
    },
    {
      id: "completed",
      label: t("dashboard.completed"),
      value: 312,
      delta: "+18%",
      deltaColor: c.success,
      icon: <Check size={15} />,
      iconBg: c.successBg,
      iconColor: c.success,
    },
    {
      id: "progress",
      label: t("dashboard.inProgress"),
      value: 56,
      delta: "+12%",
      deltaColor: c.success,
      icon: <RotateCcw size={15} />,
      iconBg: c.warningBg,
      iconColor: c.warning,
    },
    {
      id: "rejected",
      label: t("dashboard.rejected"),
      value: 84,
      delta: "-3%",
      deltaColor: c.danger,
      icon: <TriangleAlert size={15} />,
      iconBg: c.dangerBg,
      iconColor: c.danger,
    },
  ];

  // Til o'zgarganda months ham yangilansin:
  const lineLabels = useMemo(
    () => [
      t("dashboard.months.jan"),
      t("dashboard.months.feb"),
      t("dashboard.months.mar"),
      t("dashboard.months.apr"),
      t("dashboard.months.may"),
      t("dashboard.months.jun"),
      t("dashboard.months.jul"),
      t("dashboard.months.aug"),
      t("dashboard.months.sep"),
      t("dashboard.months.oct"),
      t("dashboard.months.nov"),
      t("dashboard.months.dec"),
    ],
    [i18n.language]
  );

  const yearlyLineData = {
    labels: lineLabels,
    datasets: [
      {
        label: t("dashboard.legendMonthlyActivity"),
        data: [120, 98, 135, 160, 155, 142, 170, 165, 149, 158, 172, 190],
        borderColor: c.primary,
        backgroundColor: c.primaryBg,
        tension: 0.4,
        pointRadius: 3,
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  const regionBarData = {
    labels: [
      t("dashboard.region.tashkent"),
      t("dashboard.region.samarkand"),
      t("dashboard.region.fergana"),
      t("dashboard.region.andijan"),
      t("dashboard.region.bukhara"),
    ],
    datasets: [
      { label: t("dashboard.status_completed"), data: [70, 55, 42, 38, 30], backgroundColor: c.success },
      { label: t("dashboard.status_inProgress"), data: [28, 18, 14, 12, 10], backgroundColor: c.warning },
      { label: t("dashboard.status_rejected"), data: [8, 6, 4, 3, 2], backgroundColor: c.danger },
    ],
  };

  const barOptions = {
    ...baseCartesianOptions,
    plugins: {
      ...baseCartesianOptions.plugins,
      legend: {
        position: "bottom",
        labels: { color: c.textMuted, font: { size: 12 }, boxWidth: 10, padding: 12 },
      },
    },
  };

  const donutData = {
    labels: [t("dashboard.status_completed"), t("dashboard.status_inProgress"), t("dashboard.status_rejected")],
    datasets: [
      {
        data: [312, 56, 84],
        backgroundColor: [c.success, c.warning, c.danger],
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const donutOptions = {
    cutout: "72%",
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { color: c.textMuted, font: { size: 12 }, boxWidth: 10, padding: 14 },
      },
    },
  };

  const topEmployees = [
    { name: "A. Karimov", region: "Toshkent", done: 64 },
    { name: "D. Yuldasheva", region: "Samarqand", done: 58 },
    { name: "M. Ismoilov", region: "Farg‘ona", done: 52 },
    { name: "S. Usmonova", region: "Andijon", done: 49 },
    { name: "J. Rahimov", region: "Buxoro", done: 44 },
  ];

  const renderTumanOptions = () => {
    if (!Array.isArray(tumans)) return null;
    return tumans.map((name, idx) => (
      <option key={idx} value={idx}>
        {name}
      </option>
    ));
  };

  return (
    <Box mt={3}>
      {/* Header / Filters */}
      <Box {...cardShell} mb={4}>
        <Stack direction={{ base: "column", lg: "row" }} justify="space-between" spacing={4}>
          <Box>
            <Heading size="md">{t("nav.dashboard")}</Heading>
            <Text fontSize="sm" color={c.textMuted} mt={1}>
              {t("dashboard.yearlyAppeals")} • {t("dashboard.statusDistribution")}
            </Text>
          </Box>

          <HStack spacing={3} flexWrap="wrap" justify={{ base: "flex-start", lg: "flex-end" }}>
            <Box minW="170px">
              <Text fontSize="xs" color={c.textMuted} mb={1}>
                {t("appeals.startDate")}
              </Text>
              <Input size="sm" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            </Box>

            <Box minW="170px">
              <Text fontSize="xs" color={c.textMuted} mb={1}>
                {t("appeals.endDate")}
              </Text>
              <Input size="sm" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
            </Box>

            <Box minW="220px">
              <Text fontSize="xs" color={c.textMuted} mb={1}>
                {t("dashboard.selectDistrict")}
              </Text>

              <Select
                value={selectedTumanIdx}
                placeholder={t("dashboard.selectDistrict")}
                size="sm"
                onChange={(e) => setSelectedTumanIdx(e.target.value)}
              >
                {renderTumanOptions()}
              </Select>

              {/* kerak bo‘lsa debug: */}
              {/* <Text fontSize="xs" color={c.textMuted} mt={1}>Selected: {selectedTuman}</Text> */}
            </Box>
          </HStack>
        </Stack>
      </Box>

      {/* KPI Cards */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={3} mb={4}>
        {statCards.map((card) => (
          <Box key={card.id} {...cardShell}>
            <Box
              display="inline-flex"
              alignItems="center"
              justifyContent="center"
              w="34px"
              h="34px"
              borderRadius="10px"
              mb={3}
              style={{ background: card.iconBg, color: card.iconColor }}
            >
              {card.icon}
            </Box>

            <Text fontSize="11px" color={c.textMuted} textTransform="uppercase" letterSpacing="0.06em" mb={1}>
              {card.label}
            </Text>

            <Flex alignItems="baseline" gap={2}>
              <Text fontSize="28px" fontWeight={600} fontVariantNumeric="tabular-nums">
                {card.value}
              </Text>
              <Text fontSize="13px" fontWeight={600} style={{ color: card.deltaColor }}>
                {card.delta}
              </Text>
            </Flex>
          </Box>
        ))}
      </SimpleGrid>

      {/* Main grid */}
      <Grid templateColumns="repeat(12, 1fr)" gap={4}>
        {/* Line */}
        <GridItem colSpan={{ base: 12, lg: 8 }}>
          <Box {...cardShell}>
            <Flex justify="space-between" align="center" mb={3}>
              <Text fontSize="sm" fontWeight={600}>
                {t("dashboard.yearlyAppeals")}
              </Text>
              <Badge variant="subtle" colorScheme="blue">
                Line
              </Badge>
            </Flex>

            <Box sx={{ height: "320px", position: "relative" }}>
              <Line key={i18n.language} data={yearlyLineData} options={baseCartesianOptions} />
            </Box>
          </Box>
        </GridItem>

        {/* Donut */}
        <GridItem colSpan={{ base: 12, lg: 4 }}>
          <Box {...cardShell} height="100%">
            <Flex justify="space-between" align="center" mb={3}>
              <Text fontSize="sm" fontWeight={600}>
                {t("dashboard.statusDistribution")}
              </Text>
              <Badge variant="subtle" colorScheme="purple">
                Donut
              </Badge>
            </Flex>

            <Box sx={{ height: "320px", position: "relative" }}>
              <Doughnut key={i18n.language} data={donutData} options={donutOptions} />
            </Box>
          </Box>
        </GridItem>

        {/* Grouped Bar */}
        <GridItem colSpan={{ base: 12, lg: 8 }}>
          <Box {...cardShell}>
            <Flex justify="space-between" align="center" mb={3}>
              <Text fontSize="sm" fontWeight={600}>
                {t("dashboard.regionsCompare")}
              </Text>
              <Badge variant="subtle" colorScheme="orange">
                Grouped Bar
              </Badge>
            </Flex>

            <Box sx={{ height: "300px", position: "relative" }}>
              <Bar key={i18n.language} data={regionBarData} options={barOptions} />
            </Box>
          </Box>
        </GridItem>

        {/* Top 5 employees */}
        <GridItem colSpan={{ base: 12, lg: 4 }}>
          <Box {...cardShell} height="100%">
            <Flex justify="space-between" align="center" mb={3}>
              <Text fontSize="sm" fontWeight={600}>
                {t("dashboard.topEmployees")}
              </Text>
              <Badge variant="subtle" colorScheme="green">
                Table
              </Badge>
            </Flex>

            <Table size="sm" variant="simple">
              <Thead>
                <Tr>
                  <Th>{t("dashboard.table.rank")}</Th>
                  <Th>{t("dashboard.table.employee")}</Th>
                  <Th>{t("dashboard.table.region")}</Th>
                  <Th isNumeric>{t("dashboard.table.done")}</Th>
                </Tr>
              </Thead>
              <Tbody>
                {topEmployees.slice(0, 5).map((e, i) => (
                  <Tr key={e.name}>
                    <Td>
                      <Badge>{i + 1}</Badge>
                    </Td>
                    <Td>{e.name}</Td>
                    <Td>
                      <Badge variant="subtle">{e.region}</Badge>
                    </Td>
                    <Td isNumeric>
                      <Text fontWeight={700}>{e.done}</Text>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </GridItem>
      </Grid>
    </Box>
  );
}