import { Box, Flex } from "@chakra-ui/react";
import Cookies from "js-cookie";
import { Doughnut, Line } from "react-chartjs-2";
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
} from "chart.js";
import { useEffect, useMemo, useState } from "react";
import { useColorModeValue } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { apiDashboard } from "../../Services/api/Dashboar"; // sizdagi path

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
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
    muted: useColorModeValue("#718096", "#718096"),

    successBg: useColorModeValue(
      "rgba(56,161,105,0.12)",
      "rgba(72,187,120,0.12)"
    ),
    warningBg: useColorModeValue(
      "rgba(240,180,41,0.12)",
      "rgba(247,201,72,0.12)"
    ),
    dangerBg: useColorModeValue(
      "rgba(229,62,62,0.12)",
      "rgba(245,101,101,0.12)"
    ),
    infoBg: useColorModeValue(
      "rgba(49,130,206,0.12)",
      "rgba(66,153,225,0.12)"
    ),
    primaryBg: useColorModeValue(
      "rgba(0,107,179,0.08)",
      "rgba(0,136,230,0.08)"
    ),

    textMuted: useColorModeValue("#4a5568", "#a0aec0"),
    gridLine: useColorModeValue(
      "rgba(0,0,0,0.06)",
      "rgba(255,255,255,0.06)"
    ),
    surface: useColorModeValue("#ffffff", "#0B1C26"),
    border: useColorModeValue(
      "rgba(0,0,0,0.06)",
      "rgba(255,255,255,0.06)"
    ),

    gradientBg: useColorModeValue(
      "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(248,250,252,1) 100%)",
      "linear-gradient(180deg, rgba(11,28,38,1) 0%, rgba(7,20,30,1) 100%)"
    ),

    shadowNormal: useColorModeValue(
      "0 10px 25px rgba(0,0,0,0.06)",
      "0 18px 55px rgba(0,0,0,0.45)"
    ),
    shadowHover: useColorModeValue(
      "0 14px 32px rgba(0,0,0,0.10)",
      "0 24px 70px rgba(0,0,0,0.55)"
    ),
  };
}

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const c = useChartColors();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const YEAR = 2026; // siz requestda 2026 yuboryapsiz

  const getDashboard = async () => {
    try {
      setLoading(true);
      const res = await apiDashboard.DataGet(
        YEAR,
        Cookies.get("district"),
        null,
        Cookies.get("neighborhood")
      );
      setData(res?.data ?? null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ===== Backend statuses -> map
  const statusMap = useMemo(() => {
    const arr = data?.statuses ?? [];
    return arr.reduce((acc, s) => {
      acc[s.status] = s?._count?.id ?? 0;
      return acc;
    }, {});
  }, [data]);

  // JEK_COMPLETED ni ham COMPLETED ga qo‘shib yuboramiz
  const completedCount = (statusMap.COMPLETED ?? 0) + (statusMap.JEK_COMPLETED ?? 0);
  const inProgressCount = statusMap.IN_PROGRESS ?? 0;
  const rejectedCount = statusMap.REJECTED ?? 0;

  // ===== UI Shell
  const cardShell = useMemo(
    () => ({
      bg: c.surface,
      backgroundImage: c.gradientBg,
      border: `1px solid ${c.border}`,
      borderRadius: "16px",
      p: "16px",
      boxShadow: c.shadowNormal,
      transition: "0.2s",
      _hover: { boxShadow: c.shadowHover, transform: "translateY(-2px)" },
    }),
    [c.surface, c.gradientBg, c.border, c.shadowLight, c.shadowHover]
  );


  // ===== Chart options
  const baseOptions = useMemo(
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
    [c.gridLine, c.textMuted]
  );

  const noLegend = useMemo(
    () => ({
      ...baseOptions,
      plugins: { legend: { display: false } },
    }),
    [baseOptions]
  );

  // ===== Month labels (12 oy)
  const monthLabels = useMemo(
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

  // ===== Yearly Dynamics (backend yearlyDynamics)
  const yearlyDynamics = useMemo(() => {
    const arr = data?.yearlyDynamics;
    if (Array.isArray(arr) && arr.length === 12) return arr;
    return Array(12).fill(0);
  }, [data]);

  const yearlyLineData = useMemo(
    () => ({
      labels: monthLabels,
      datasets: [
        {
          label: String(YEAR),
          data: yearlyDynamics,
          borderColor: c.primary,
          backgroundColor: c.primaryBg,
          tension: 0.4,
          pointRadius: 3,
          borderWidth: 1.5,
          fill: true,
        },
      ],
    }),
    [YEAR, c.primary, c.primaryBg, monthLabels, yearlyDynamics]
  );

  // ===== Today Activity (backend todayActivity) -> kichik line (2 nuqta)
  const todayReceived = data?.todayActivity?.received ?? 0;
  const todayFinished = data?.todayActivity?.finished ?? 0;

  const todayActivityLine = useMemo(
    () => ({
      labels: [
        t("dashboard.received", { defaultValue: "Received" }),
        t("dashboard.finished", { defaultValue: "Finished" }),
      ],
      datasets: [
        {
          label: t("dashboard.todayActivity", { defaultValue: "Today" }),
          data: [todayReceived, todayFinished],
          borderColor: c.success,
          backgroundColor: c.successBg,
          tension: 0.35,
          pointRadius: 4,
          borderWidth: 1.5,
          fill: true,
        },
      ],
    }),
    [c.success, c.successBg, t, i18n.language, todayReceived, todayFinished]
  );

  // ===== Monthly + Today (10 ta nuqta) -> yearlyDynamics dan oxirgi 10 oy
  const last10MonthLabels = useMemo(() => monthLabels.slice(2), [monthLabels]); // Mar..Dec (10 ta)
  const last10MonthData = useMemo(() => yearlyDynamics.slice(2), [yearlyDynamics]);


  const monthlyAndTodayData = useMemo(
    () => ({
      labels: last10MonthLabels,
      datasets: [
        {
          label: t("dashboard.legendMonthlyActivity", { defaultValue: "Monthly activity" }),
          data: last10MonthData,
          borderColor: c.primary,
          backgroundColor: c.primaryBg,
          tension: 0.4,
          pointRadius: 3,
          borderWidth: 1.5,
          fill: true,
        },
        {
          label: t("dashboard.legendToday", { defaultValue: "Today" }),
          data: Array(10).fill(0).map((v, idx) => (idx === 9 ? todayReceived : v)),
          borderColor: c.warning,
          backgroundColor: "transparent",
          pointBackgroundColor: c.warning,
          pointRadius: Array(10).fill(0).map((v, idx) => (idx === 9 ? 6 : 0)),
          tension: 0.35,
          borderWidth: 1.5,
        },
      ],
    }),
    [
      c.primary,
      c.primaryBg,
      c.warning,
      last10MonthData,
      last10MonthLabels,
      t,
      i18n.language,
      todayReceived,
    ]
  );

  // ===== Donut (statuses)
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
      c.danger,
      c.success,
      c.warning,
      completedCount,
      inProgressCount,
      rejectedCount,
      t,
      i18n.language,
    ]
  );

  // ===== KPI Cards
  const statCards = useMemo(
    () => [
      {
        id: "total",
        label: t("dashboard.totalAppeals", { defaultValue: "Total requests" }),
        value: data?.totalRequests || 0,
        delta: "",
        deltaColor: c.success,
        icon: <File size={15} />,
        iconBg: c.infoBg,
        iconColor: c.chartOut,
      },
      {
        id: "completed",
        label: t("dashboard.completed", { defaultValue: "Completed" }),
        value: completedCount,
        delta: "",
        deltaColor: c.success,
        icon: <Check size={15} />,
        iconBg: c.successBg,
        iconColor: c.success,
      },
      {
        id: "progress",
        label: t("dashboard.inProgress", { defaultValue: "In progress" }),
        value: inProgressCount,
        delta: "",
        deltaColor: c.success,
        icon: <RotateCcw size={15} />,
        iconBg: c.warningBg,
        iconColor: c.warning,
      },
      {
        id: "rejected",
        label: t("dashboard.rejected", { defaultValue: "Rejected" }),
        value: rejectedCount,
        delta: "",
        deltaColor: c.danger,
        icon: <TriangleAlert size={15} />,
        iconBg: c.dangerBg,
        iconColor: c.danger,
      },
    ],
    [
      c.chartOut,
      c.danger,
      c.dangerBg,
      c.success,
      c.successBg,
      c.infoBg,
      c.warning,
      c.warningBg,
      completedCount,
      data?.totalRequests,
      inProgressCount,
      rejectedCount,
      t,
      i18n.language,
    ]
  );

  return (
    <Box mt={3} mb={10}>
      {/* KPI */}
      <Flex gap={3} mb={4}>
        {statCards.map((card) => (
          <Box key={card.id} flex={1} {...cardShell} opacity={loading ? 0.7 : 1}>
            <Box
              display="inline-flex"
              alignItems="center"
              justifyContent="center"
              w="32px"
              h="32px"
              borderRadius="8px"
              mb={3}
              style={{ background: card.iconBg, color: card.iconColor }}
            >
              {card.icon}
            </Box>

            <Box
              fontSize="11px"
              color={c.textMuted}
              textTransform="uppercase"
              letterSpacing="0.05em"
              mb={1}
            >
              {card.label}
            </Box>


            <Flex alignItems="baseline" gap={2}>
              <Box
                as="span"
                fontSize="26px"
                fontWeight={600}
                fontVariantNumeric="tabular-nums"
              >
                {card.value}
              </Box>
              {card.delta ? (
                <Box as="span" fontSize="13px" fontWeight={600} style={{ color: card.deltaColor }}>
                  {card.delta}
                </Box>
              ) : null}
            </Flex>
          </Box>
        ))}
      </Flex>

      {/* Charts Row 1 */}
      <Flex gap={4} mb={4}>
        <Box {...cardShell} flex={1} opacity={loading ? 0.7 : 1}>
          <Box fontSize="xs" color={c.textMuted} fontWeight={600} mb={3}>
            {t("dashboard.yearlyAppeals", { defaultValue: "Yearly appeals" })}
          </Box>
          <Box h="220px" position="relative">
            <Line key={i18n.language} data={yearlyLineData} options={baseOptions} />
          </Box>
        </Box>

        <Box {...cardShell} flex={1} opacity={loading ? 0.7 : 1}>
          <Box fontSize="xs" color={c.textMuted} fontWeight={600} mb={3}>
            {t("dashboard.todayMonthlyDailyActivity", { defaultValue: "Today activity" })}
          </Box>
          <Box h="220px" position="relative">
            <Line key={i18n.language} data={todayActivityLine} options={noLegend} />
          </Box>
        </Box>
      </Flex>

      {/* Charts Row 2 */}
      <Flex gap={4}>
        <Box {...cardShell} flex={1.6} opacity={loading ? 0.7 : 1}>
          <Box fontSize="xs" color={c.textMuted} fontWeight={600} mb={3}>
            {t("dashboard.monthlyAndTodayActivity", { defaultValue: "Monthly + Today activity" })}
          </Box>
          <Box h="220px" position="relative">
            <Line key={i18n.language} data={monthlyAndTodayData} options={baseOptions} />
          </Box>
        </Box>

        <Box {...cardShell} flex={1} opacity={loading ? 0.7 : 1}>
          <Box fontSize="xs" color={c.textMuted} fontWeight={600} mb={3}>
            {t("dashboard.statusDistribution", { defaultValue: "Status distribution" })}
          </Box>
          <Box h="220px" position="relative">
            <Doughnut
              key={i18n.language}
              data={donutData}
              options={{
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
              }}
            />
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}
