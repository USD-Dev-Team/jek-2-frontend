import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import { useLocation, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";

export default function Breadcumb() {
  const { t } = useTranslation();
  const loc = useLocation();

  // URL prefixlarni breadcrumbda ko‘rsatmaymiz
  const hiddenSegments = useMemo(
    () => new Set(["inspection", "jek", "government"]),
    []
  );

  const segmentToKey = {
    dashboard: "nav.dashboard",
    appeals: "nav.appeals",
    murojatlar: "nav.appeals",
    hodimlar: "nav.jekEmployees",
    account: "nav.account",
    'mening-murojatlarim': "nav.myAppeals",
  };

  const isUUID = (segment) =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(segment);

  const crumbs = useMemo(() => {
    const raw = loc.pathname.split("/").filter(Boolean);

    return raw
      .map((segment, index) => ({
        segment,
        to: "/" + raw.slice(0, index + 1).join("/"),
      }))
      .filter(({ segment }) => {
        const normalized = decodeURIComponent(segment).toLowerCase();
        return !hiddenSegments.has(normalized);
      });
  }, [loc.pathname, hiddenSegments]);

  const getLabel = (segment) => {
    const normalized = decodeURIComponent(segment).toLowerCase();

    if (isUUID(normalized)) {
      return t("common.detail") || "Batafsil";
    }

    const key = segmentToKey[normalized];
    if (key) return t(key);

    return decodeURIComponent(segment);
  };

  return (
    <Breadcrumb p={3}>
      {crumbs.map(({ segment, to }) => (
        <BreadcrumbItem fontSize="20px" fontWeight="bold" key={to}>
          <BreadcrumbLink as={Link} to={to}>
            {getLabel(segment)}
          </BreadcrumbLink>
        </BreadcrumbItem>
      ))}
    </Breadcrumb>
  );
}