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
  };

  const crumbs = useMemo(() => {
    const raw = loc.pathname.split("/").filter(Boolean);

    return raw
      .map((segment, index) => ({
        segment,
        to: "/" + raw.slice(0, index + 1).join("/"), // link to‘g‘ri qoladi
      }))
      .filter(({ segment }) => {
        const normalized = decodeURIComponent(segment).toLowerCase();
        return !hiddenSegments.has(normalized);
      });
  }, [loc.pathname, hiddenSegments]);

  const getLabel = (segment) => {
    const normalized = decodeURIComponent(segment).toLowerCase();
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