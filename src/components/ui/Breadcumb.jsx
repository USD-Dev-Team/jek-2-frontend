import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import { useLocation, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";

export default function Breadcumb() {
  const { t, i18n } = useTranslation();
  const loc = useLocation();

  const pathnames = useMemo(
    () => loc.pathname.split("/").filter(Boolean),
    [loc.pathname]
  );

  const segmentToKey = {
    dashboard: "nav.dashboard",
    appeals: "nav.appeals",
    murojatlar: "nav.appeals",
    hodimlar: "nav.jekEmployees",
  };

  const getLabel = (segment) => {
    const normalized = decodeURIComponent(segment).toLowerCase();
    const key = segmentToKey[normalized];

    if (key) return t(key);

    // agar boshqa segment bo‘lsa (id, subpage) shuni chiqaradi
    const decoded = decodeURIComponent(segment);
    return decoded;
  };

  return (
    <Breadcrumb p={3}>
      {pathnames.map((segment, index) => {
        const to = "/" + pathnames.slice(0, index + 1).join("/");

        return (
          <BreadcrumbItem fontSize="20px" fontWeight="bold" key={to}>
            <BreadcrumbLink as={Link} to={to}>
              {getLabel(segment)}
            </BreadcrumbLink>
          </BreadcrumbItem>
        );
      })}
    </Breadcrumb>
  );
}