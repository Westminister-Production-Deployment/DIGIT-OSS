import { EmployeeModuleCard, PropertyHouse } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const BRCard = () => {
  const { t } = useTranslation();

  const [total, setTotal] = useState("-");
  const { data, isLoading, isFetching, isSuccess } = Digit.Hooks.useNewInboxGeneral({
    tenantId: Digit.ULBService.getCurrentTenantId(),
    ModuleCode: "BR",
    filters: { limit: 10, offset: 0, services: ["PT.CREATE", "PT.MUTATION", "PT.UPDATE"] },
    config: {
      select: (data) => {
        return data?.totalCount || "-";
      },
      enabled: Digit.Utils.ptAccess(),
    },
  });

  useEffect(() => {
    if (!isFetching && isSuccess) setTotal(data);
  }, [isFetching]);

  if (!Digit.Utils.ptAccess()) {
    return null;
  }
  const links = [
  
    {
      label: t("Birth"),
      link: `/digit-ui/employee/pt/new-application`,
      role: "PT_CEMP",
    },
    
  ];
  const PT_CEMP = Digit.UserService.hasAccess(["PT_CEMP"]) || false;

  const propsForModuleCard = {
    Icon: <PropertyHouse />,
    moduleName: t("BirthRegistration"),
    kpis: [
      {
        count: total,
        label: t("INBOX"),
        link: `/digit-ui/employee/pt/inbox`,
      },
    ],
    links: links.filter((link) => !link?.role || PT_CEMP),
  };

  if (PT_CEMP && !propsForModuleCard.links?.[2]) {
    propsForModuleCard.links.push({
      label: t("NEW_REGISTRATION"),
      link: `/digit-ui/employee/pt/new-application`,
    });
  }

  return <EmployeeModuleCard {...propsForModuleCard} />;
};


export default BRCard;