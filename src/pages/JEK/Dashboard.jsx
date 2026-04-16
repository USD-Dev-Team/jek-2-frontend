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
import { useEffect, useState } from "react";
import { useColorModeValue } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { apiDashboard } from "../../Services/api/Dashboar";


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

    successBg: useColorModeValue("rgba(56,161,105,0.12)", "rgba(72,187,120,0.12)"),
    warningBg: useColorModeValue("rgba(240,180,41,0.12)", "rgba(247,201,72,0.12)"),
    dangerBg: useColorModeValue("rgba(229,62,62,0.12)", "rgba(245,101,101,0.12)"),
    infoBg: useColorModeValue("rgba(49,130,206,0.12)", "rgba(66,153,225,0.12)"),
    primaryBg: useColorModeValue("rgba(0,107,179,0.08)", "rgba(0,136,230,0.08)"),

    textMuted: useColorModeValue("#4a5568", "#a0aec0"),
    gridLine: useColorModeValue("rgba(0,0,0,0.06)", "rgba(255,255,255,0.06)"),
    surface: useColorModeValue("#ffffff", "#0B1C26"),
    border: useColorModeValue("rgba(0,0,0,0.06)", "rgba(255,255,255,0.06)"),

    // ✅ Gradient
    gradientBg: useColorModeValue(
      "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(248,250,252,1) 100%)",
      "linear-gradient(180deg, rgba(11,28,38,1) 0%, rgba(7,20,30,1) 100%)"
    ),

    // ✅ Shadow
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

  const getDashboard = async () => {
    try {
      setLoading(true);
      const res = await apiDashboard.DataGet(2026, Cookies.get('district'), Cookies.get('user_id'), Cookies.get('neighborhood'));
      setData(res.data);
    } finally {
      setLoading(false);
    }
  };

  const getStatusCount = (status) => {
    return data?.statuses.find(s => s.status === status)?._count.id || 0;
  };

  useEffect(() => {
    getDashboard();
  }, []);

  const cardShell = {
    backgroundImage: c.gradientBg,
    border: `1px solid ${c.border}`,
    borderRadius: "16px",
    p: "16px",
    boxShadow: c.shadowNormal,
  };

  const baseOptions = {
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
  };

  const noLegend = {
    ...baseOptions,
    plugins: { legend: { display: false } },
  };

  const lineData = {
    labels: [
      t("dashboard.months.jan"),
      t("dashboard.months.feb"),
      t("dashboard.months.mar"),
      t("dashboard.months.apr"),
      t("dashboard.months.may"),
      t("dashboard.months.jun"),
    ],
    datasets: [
      {
        label: "2025",
        data: [10, 20, 30, 40, 60, 70],
        borderColor: c.primary,
        backgroundColor: c.primaryBg,
        tension: 0.4,
        pointRadius: 3,
        borderWidth: 1.5,
        fill: true,
      },
      {
        label: "2026",
        data: [5, 15, 25, 30, 45, 50],
        borderColor: c.muted,
        backgroundColor: "transparent",
        tension: 0.4,
        pointRadius: 3,
        borderWidth: 1.5,
        borderDash: [4, 3],
      },
    ],
  };

  const dailyData = {
    labels: Array.from({ length: 30 }, (_, i) => i + 1),
    datasets: [
      {
        label: t("dashboard.legendToday"),
        data: [
          5, 8, 6, 7, 10, 12, 9, 14, 11, 15,
          13, 8, 9, 10, 12, 14, 16, 15, 10, 8,
          9, 11, 13, 15, 12, 10, 8, 9, 14, 12,
        ],
        borderColor: c.success,
        backgroundColor: c.successBg,
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 1.5,
        fill: true,
      },
    ],
  };

  const activityData = {
    labels: Array.from({ length: 10 }, (_, i) => i + 1),
    datasets: [
      {
        label: t("dashboard.legendMonthlyActivity"),
        data: [50, 60, 45, 70, 80, 75, 90, 85, 100, 95],
        borderColor: c.primary,
        backgroundColor: c.primaryBg,
        tension: 0.4,
        pointRadius: 3,
        borderWidth: 1.5,
        fill: true,
      },
      {
        label: t("dashboard.legendToday"),
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 25],
        borderColor: c.warning,
        backgroundColor: "transparent",
        pointBackgroundColor: c.warning,
        pointRadius: [0, 0, 0, 0, 0, 0, 0, 0, 0, 6],
        tension: 0.4,
        borderWidth: 1.5,
      },
    ],
  };

  const donutData = {
    labels: [
      t("dashboard.status_completed"),
      t("dashboard.status_inProgress"),
      t("dashboard.status_rejected"),
    ],
    datasets: [
      {
        data: [312, 56, 84],
        backgroundColor: [c.success, c.warning, c.danger],
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const statCards = [
    {
      id: "total",
      label: t("dashboard.totalAppeals"),
      value: data?.totalRequests || 0,
      delta: "+25%",
      deltaColor: c.success,
      icon: <File size={15} />,
      iconBg: c.infoBg,
      iconColor: c.chartOut,
    },
    {
      id: "completed",
      label: t("dashboard.completed"),
      value: getStatusCount("COMPLETED"),
      delta: "+18%",
      deltaColor: c.success,
      icon: <Check size={15} />,
      iconBg: c.successBg,
      iconColor: c.success,
    },
    {
      id: "progress",
      label: t("dashboard.inProgress"),
      value: getStatusCount("IN_PROGRESS"),
      delta: "+12%",
      deltaColor: c.success,
      icon: <RotateCcw size={15} />,
      iconBg: c.warningBg,
      iconColor: c.warning,
    },
    {
      id: "rejected",
      label: t("dashboard.rejected"),
      value: getStatusCount("REJECTED"),
      delta: "-3%",
      deltaColor: c.danger,
      icon: <TriangleAlert size={15} />,
      iconBg: c.dangerBg,
      iconColor: c.danger,
    },
  ];

  return (
    <Box mt={3}>

      {/* ✅ KPI Cards */}
      <Flex gap={3} mb={4}>
        {statCards.map((card) => (
          <Box key={card.id} flex={1} {...cardShell}>
            {/* Icon */}
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

            {/* Label */}
            <Box
              fontSize="11px"
              color={c.textMuted}
              textTransform="uppercase"
              letterSpacing="0.05em"
              mb={1}
            >
              {card.label}
            </Box>

            {/* Value + Delta */}
            <Flex alignItems="baseline" gap={2}>
              <Box
                as="span"
                fontSize="26px"
                fontWeight={600}
                fontVariantNumeric="tabular-nums"
              >
                {card.value}
              </Box>
              <Box
                as="span"
                fontSize="13px"
                fontWeight={600}
                style={{ color: card.deltaColor }}
              >
                {card.delta}
              </Box>
            </Flex>
          </Box>
        ))}
      </Flex>

      {/* ✅ Charts Row 1 */}
      <Flex gap={4} mb={4}>
        <Box {...cardShell} flex={1}>
          <Box fontSize="xs" color={c.textMuted} fontWeight={600} mb={3}>
            {t("dashboard.yearlyAppeals")}
          </Box>
          <Box h="220px" position="relative">
            <Line key={i18n.language} data={lineData} options={baseOptions} />
          </Box>
        </Box>

        <Box {...cardShell} flex={1}>
          <Box fontSize="xs" color={c.textMuted} fontWeight={600} mb={3}>
            {t("dashboard.todayMonthlyDailyActivity")}
          </Box>
          <Box h="220px" position="relative">
            <Line key={i18n.language} data={dailyData} options={noLegend} />
          </Box>
        </Box>
      </Flex>

      {/* ✅ Charts Row 2 */}
      <Flex gap={4}>
        <Box {...cardShell} flex={1.6}>
          <Box fontSize="xs" color={c.textMuted} fontWeight={600} mb={3}>
            {t("dashboard.monthlyAndTodayActivity")}
          </Box>
          <Box h="220px" position="relative">
            <Line key={i18n.language} data={activityData} options={baseOptions} />
          </Box>
        </Box>

        <Box {...cardShell} flex={1}>
          <Box fontSize="xs" color={c.textMuted} fontWeight={600} mb={3}>
            {t("dashboard.statusDistribution")}
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