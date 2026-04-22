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
import Cookies from "js-cookie";

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

import { useEffect, useMemo, useState, useCallback } from "react";
import { useColorModeValue } from "@chakra-ui/react";
import adress from "../../constants/mahallas.json";
import { useTranslation } from "react-i18next";
import { apiDashboard } from "../../Services/api/Dashboar";

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
    border: useColorModeValue("rgba(0,0,0,0.06)", "rgba(255,255,255,0.06)"),

    shadowLight: useColorModeValue(
      "0 10px 25px rgba(0,0,0,0.06)",
      "0 18px 55px rgba(0,0,0,0.45)"
    ),
    shadowHover: useColorModeValue(
      "0 14px 32px rgba(0,0,0,0.10)",
      "0 24px 70px rgba(0,0,0,0.55)"
    ),

    gradientBg: useColorModeValue(
      "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(248,250,252,1) 100%)",
      "linear-gradient(180deg, rgba(11,28,38,1) 0%, rgba(7,20,30,1) 100%)"
    ),
  };
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const { t, i18n } = useTranslation();
  const c = useChartColors();

  const [yearInput, setYearInput] = useState("2026");
  const [debouncedYear, setDebouncedYear] = useState("");
  const [selectedTumanKey, setSelectedTumanKey] = useState("");
  const [selectedMahallaKey, setSelectedMahallaKey] = useState("");

  const lang = i18n.language || "uz";
  const addressData = adress?.[lang] ?? adress?.uz ?? {};

  const tumans = addressData?.addresses ?? {};
  const mahallas = addressData?.mahallas ?? {};

  const mahallaObj = useMemo(() => {
    if (!selectedTumanKey) return {};
    const districtLabelTranslated = tumans?.[selectedTumanKey];
    return mahallas?.[selectedTumanKey] || mahallas?.[districtLabelTranslated] || {};
  }, [selectedTumanKey, tumans, mahallas]);

  const selectedTumanLabel = tumans?.[selectedTumanKey] || "";
  const selectedMahallaLabel = mahallaObj?.[selectedMahallaKey] || "";

  const YEAR = useMemo(() => {
    const y = debouncedYear.trim();

    if (/^\d{4}$/.test(y)) {
      return Number(y);
    }

    return null;
  }, [debouncedYear]);
  const getDashboardINS = useCallback(async () => {
    if (!YEAR) return; // ❗ invalid bo‘lsa API chaqirmaydi

    try {
      setLoading(true);

      const res = await apiDashboard.DataGet(
        YEAR,
        selectedTumanKey,
        '',
        selectedMahallaKey
      );

      setData(res?.data ?? null);
    } finally {
      setLoading(false);
    }
  }, [YEAR, selectedTumanKey, selectedMahallaKey]);

  useEffect(() => {
    getDashboardINS();
  }, [getDashboardINS]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedYear(yearInput.trim());
    }, 500);

    return () => clearTimeout(timer);
  }, [yearInput]);

  const statusMap = useMemo(() => {
    const arr = data?.statuses ?? [];
    return arr.reduce((acc, s) => {
      acc[s.status] = s?._count?.id ?? 0;
      return acc;
    }, {});
  }, [data]);

  const completedCount = (statusMap.COMPLETED ?? 0) + (statusMap.JEK_COMPLETED ?? 0);
  const inProgressCount = statusMap.IN_PROGRESS ?? 0;
  const rejectedCount = statusMap.REJECTED ?? 0;

  const cardShell = useMemo(
    () => ({
      bg: c.surface,
      backgroundImage: c.gradientBg,
      border: `1px solid ${c.border}`,
      borderRadius: "16px",
      p: "16px",
      boxShadow: c.shadowLight,
      transition: "0.2s",
      _hover: { boxShadow: c.shadowHover, transform: "translateY(-2px)" },
    }),
    [c.surface, c.gradientBg, c.border, c.shadowLight, c.shadowHover]
  );

  const baseCartesianOptions = useMemo(
    () => ({
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: c.textMuted,
            font: { size: 12 },
            boxWidth: 10,
            padding: 12,
          },
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
    }),
    [c.textMuted, c.gridLine]
  );

  const statCards = useMemo(
    () => [
      {
        id: "total",
        label: t("dashboard.totalAppeals"),
        value: data?.totalRequests ?? 0,
        delta: "",
        deltaColor: c.success,
        icon: <File size={15} />,
        iconBg: c.infoBg,
        iconColor: c.chartOut,
      },
      {
        id: "completed",
        label: t("dashboard.completed"),
        value: completedCount,
        delta: "",
        deltaColor: c.success,
        icon: <Check size={15} />,
        iconBg: c.successBg,
        iconColor: c.success,
      },
      {
        id: "progress",
        label: t("dashboard.inProgress"),
        value: inProgressCount,
        delta: "",
        deltaColor: c.success,
        icon: <RotateCcw size={15} />,
        iconBg: c.warningBg,
        iconColor: c.warning,
      },
      {
        id: "rejected",
        label: t("dashboard.rejected"),
        value: rejectedCount,
        delta: "",
        deltaColor: c.danger,
        icon: <TriangleAlert size={15} />,
        iconBg: c.dangerBg,
        iconColor: c.danger,
      },
    ],
    [
      t,
      data?.totalRequests,
      completedCount,
      inProgressCount,
      rejectedCount,
      c.success,
      c.infoBg,
      c.chartOut,
      c.successBg,
      c.warningBg,
      c.warning,
      c.dangerBg,
      c.danger,
    ]
  );

  const lineLabels = useMemo(
    () => [
      t("dashboard.months.jan", { defaultValue: "Jan" }),
      t("dashboard.months.feb", { defaultValue: "Feb" }),
      t("dashboard.months.mar", { defaultValue: "Mar" }),
      t("dashboard.months.apr", { defaultValue: "Apr" }),
      t("dashboard.months.may", { defaultValue: "May" }),
      t("dashboard.months.jun", { defaultValue: "Jun" }),
      t("dashboard.months.jul", { defaultValue: "Jul" }),
      t("dashboard.months.aug", { defaultValue: "Aug" }),
      t("dashboard.months.sep", { defaultValue: "Sep" }),
      t("dashboard.months.oct", { defaultValue: "Oct" }),
      t("dashboard.months.nov", { defaultValue: "Nov" }),
      t("dashboard.months.dec", { defaultValue: "Dec" }),
    ],
    [t, i18n.language]
  );

  const yearlyDynamics = useMemo(() => {
    const arr = data?.yearlyDynamics;
    if (Array.isArray(arr) && arr.length === 12) return arr;
    return Array(12).fill(0);
  }, [data]);

  const yearlyLineData = useMemo(
    () => ({
      labels: lineLabels,
      datasets: [
        {
          label: t("dashboard.legendMonthlyActivity", { defaultValue: "Monthly activity" }),
          data: yearlyDynamics,
          borderColor: c.primary,
          backgroundColor: c.primaryBg,
          tension: 0.4,
          pointRadius: 3,
          borderWidth: 2,
          fill: true,
        },
      ],
    }),
    [lineLabels, t, yearlyDynamics, c.primary, c.primaryBg]
  );

  // ====== Donut (backend statuses)
  const donutData = useMemo(
    () => ({
      labels: [
        t("dashboard.status_completed", { defaultValue: "Completed" }),
        t("dashboard.status_inProgress", { defaultValue: "In progress" }),
        t("dashboard.status_rejected", { defaultValue: "Rejected" }),
      ],
      datasets: [
        {
          data: [completedCount, inProgressCount, rejectedCount],
          backgroundColor: [c.success, c.warning, c.danger],
          borderWidth: 0,
          hoverOffset: 4,
        },
      ],
    }),
    [
      t,
      completedCount,
      inProgressCount,
      rejectedCount,
      c.success,
      c.warning,
      c.danger,
      i18n.language,
    ]
  );

  const donutOptions = useMemo(
    () => ({
      cutout: "72%",
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: c.textMuted,
            font: { size: 12 },
            boxWidth: 10,
            padding: 14,
          },
        },
      },
    }),
    [c.textMuted]
  );

  const fallbackRegions = useMemo(
    () => [
      { region: t("dashboard.region.tashkent", { defaultValue: "Tashkent" }), completed: 70, inProgress: 28, rejected: 8 },
      { region: t("dashboard.region.samarkand", { defaultValue: "Samarkand" }), completed: 55, inProgress: 18, rejected: 6 },
      { region: t("dashboard.region.fergana", { defaultValue: "Fergana" }), completed: 42, inProgress: 14, rejected: 4 },
      { region: t("dashboard.region.andijan", { defaultValue: "Andijan" }), completed: 38, inProgress: 12, rejected: 3 },
      { region: t("dashboard.region.bukhara", { defaultValue: "Bukhara" }), completed: 30, inProgress: 10, rejected: 2 },
    ],
    [t, i18n.language]
  );

  const regionsCompare = useMemo(() => {
    const rows = data?.regionsCompare;
    return Array.isArray(rows) && rows.length ? rows : fallbackRegions;
  }, [data, fallbackRegions]);

  const regionBarData = useMemo(
    () => ({
      labels: regionsCompare.map((r) => r.region),
      datasets: [
        {
          label: t("dashboard.status_completed", { defaultValue: "Completed" }),
          data: regionsCompare.map((r) => r.completed ?? 0),
          backgroundColor: c.success,
        },
        {
          label: t("dashboard.status_inProgress", { defaultValue: "In progress" }),
          data: regionsCompare.map((r) => r.inProgress ?? 0),
          backgroundColor: c.warning,
        },
        {
          label: t("dashboard.status_rejected", { defaultValue: "Rejected" }),
          data: regionsCompare.map((r) => r.rejected ?? 0),
          backgroundColor: c.danger,
        },
      ],
    }),
    [regionsCompare, t, c.success, c.warning, c.danger, i18n.language]
  );

  const barOptions = useMemo(
    () => ({
      ...baseCartesianOptions,
      plugins: {
        ...baseCartesianOptions.plugins,
        legend: {
          position: "bottom",
          labels: {
            color: c.textMuted,
            font: { size: 12 },
            boxWidth: 10,
            padding: 12,
          },
        },
      },
    }),
    [baseCartesianOptions, c.textMuted]
  );

  const topEmployees = useMemo(() => {
    const rows = data?.topEmployees;
    if (Array.isArray(rows) && rows.length) return rows;

    return [
      { name: "A. Karimov", region: "Toshkent", done: 64 },
      { name: "D. Yuldasheva", region: "Samarqand", done: 58 },
      { name: "M. Ismoilov", region: "Farg'ona", done: 52 },
      { name: "S. Usmonova", region: "Andijon", done: 49 },
      { name: "J. Rahimov", region: "Buxoro", done: 44 },
    ];
  }, [data]);

  return (
    <Box mt={3} mb={10}>
      <Box {...cardShell} mb={4} opacity={loading ? 0.7 : 1}>
        <Stack direction={{ base: "column", lg: "row" }} justify="space-between" spacing={4}>
          <Box>
            <Heading size="md">{t("nav.dashboard")}</Heading>
            <Text fontSize="sm" color={c.textMuted} mt={1}>
              {t("dashboard.yearlyAppeals")} • {t("dashboard.statusDistribution")}
            </Text>

            {(selectedTumanKey || selectedMahallaKey) && (
              <Text fontSize="xs" color={c.textMuted} mt={2}>
                {t("dashboard.selectDistrict")}: <b>{selectedTumanLabel || "-"}</b>
                {selectedMahallaKey ? (
                  <>
                    {" "}
                    / {t("register.mahalla") || "Mahalla"}: <b>{selectedMahallaLabel || selectedMahallaKey}</b>
                  </>
                ) : null}
              </Text>
            )}
          </Box>

          <HStack spacing={3} flexWrap="wrap" justify={{ base: "flex-start", lg: "flex-end" }}>
            <Box minW="170px">
              <Text fontSize="xs" color={c.textMuted} mb={1}>
                Yil
              </Text>
              <Input
                size="sm"
                type="number"
                value={yearInput}
                rounded={'10px'}
                placeholder="Yilni kiriting"
                onChange={(e) => setYearInput(e.target.value)}
              />
            </Box>

            <Box minW="220px">
              <Text fontSize="xs" color={c.textMuted} mb={1}>
                {t("dashboard.selectDistrict")}
              </Text>
              <Select
                value={selectedTumanKey}
                placeholder={t("dashboard.selectDistrict")}
                size="sm"
                onChange={(e) => {
                  setSelectedTumanKey(e.target.value);
                  setSelectedMahallaKey("");
                }}
              >
                {Object.entries(tumans).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </Select>
            </Box>

            <Box minW="220px">
              <Text fontSize="xs" color={c.textMuted} mb={1}>
                {t("register.mahalla") || "Mahalla"}
              </Text>
              <Select
                value={selectedMahallaKey}
                placeholder={t("register.mahallaPlaceholder") || "Mahalla"}
                size="sm"
                isDisabled={!selectedTumanKey}
                onChange={(e) => setSelectedMahallaKey(e.target.value)}
              >
                {Object.entries(mahallaObj).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </Select>
            </Box>
          </HStack>
        </Stack>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={3} mb={4}>
        {statCards.map((card) => (
          <Box key={card.id} {...cardShell} opacity={loading ? 0.7 : 1}>
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

            <Text
              fontSize="11px"
              color={c.textMuted}
              textTransform="uppercase"
              letterSpacing="0.06em"
              mb={1}
            >
              {card.label}
            </Text>

            <Flex alignItems="baseline" gap={2}>
              <Text fontSize="28px" fontWeight={600} fontVariantNumeric="tabular-nums">
                {card.value}
              </Text>
              {card.delta ? (
                <Text fontSize="13px" fontWeight={600} style={{ color: card.deltaColor }}>
                  {card.delta}
                </Text>
              ) : null}
            </Flex>
          </Box>
        ))}
      </SimpleGrid>

      <Grid templateColumns="repeat(12, 1fr)" gap={4}>
        <GridItem colSpan={{ base: 12, lg: 8 }}>
          <Box {...cardShell} opacity={loading ? 0.7 : 1}>
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

        <GridItem colSpan={{ base: 12, lg: 4 }}>
          <Box {...cardShell} height="100%" opacity={loading ? 0.7 : 1}>
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

        <GridItem colSpan={{ base: 12, lg: 8 }}>
          <Box {...cardShell} opacity={loading ? 0.7 : 1}>
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

        <GridItem colSpan={{ base: 12, lg: 4 }}>
          <Box {...cardShell} height="100%" opacity={loading ? 0.7 : 1}>
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
                  <Tr key={`${e.name}-${i}`}>
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