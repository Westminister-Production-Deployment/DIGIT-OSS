import { Card, CardSubHeader, Header, LinkButton, Loader, Row, StatusTable, CardSectionHeader } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation} from "react-router-dom";
//import PropertyDocument from "../../pageComponents/PropertyDocument";

const WSAdditionalDetails = () => {
  const { t } = useTranslation();
  const user = Digit.UserService.getUser();
  const tenantId = user?.info?.permanentCity || Digit.ULBService.getCurrentTenantId();
  const applicationNobyData = window.location.href.substring(window.location.href.indexOf("WS_")) || window.location.href.substring(window.location.href.indexOf("SW_"));

  let filter1 = {tenantId: "pb.amritsar", applicationNumber: applicationNobyData }
const { isLoading, isError, error, data } = Digit.Hooks.ws.useMyApplicationSearch({ filters: filter1 }, { filters: filter1 });



if (isLoading) {
  return <Loader />;
}

  return (
    <React.Fragment>
      <Header>{t("WS_COMMON_ADDN_DETAILS")}</Header>
      <div className='hide-seperator'>
        <Card>
          <CardSubHeader>{t("WS_COMMON_CONNECTION_DETAIL")}</CardSubHeader>
          <StatusTable>
            <Row className="border-none"  label={t("WS_COMMON_TABLE_COL_CONNECTIONTYPE_LABEL")} text={data?.WaterConnection?.[0]?.connectionType || t("NA")} textStyle={{ whiteSpace: "pre" }} />
            <Row className="border-none"  label={t("WS_SERV_DETAIL_NO_OF_TAPS")} text={data?.WaterConnection?.[0]?.noOfTaps} textStyle={{ whiteSpace: "pre" }} />
            <Row className="border-none"  label={t("WS_SERV_DETAIL_PIPE_SIZE")} text={data?.WaterConnection?.[0]?.pipeSize || "NA"} textStyle={{ whiteSpace: "pre" }} />
            <Row className="border-none"  label={t("WS_SERV_DETAIL_WATER_SOURCE")} text={data?.WaterConnection?.[0]?.waterSource || "NA"} textStyle={{ whiteSpace: "pre" }} />
            <Row className="border-none"  label={t("WS_SERV_DETAIL_WATER_SUB_SOURCE")} text={data?.WaterConnection?.[0]?.waterSource || "NA"} textStyle={{ whiteSpace: "pre" }} />
          </StatusTable>
        </Card>
        {data?.WaterConnection?.[0]?.plumberInfo && <Card>
          <CardSubHeader>{t("WS_COMMON_PLUMBER_DETAILS")}</CardSubHeader>
          <StatusTable>
            <Row className="border-none"  label={t("WS_ADDN_DETAILS_PLUMBER_PROVIDED_BY")} text={data?.WaterConnection?.[0]?.plumberInfo || t("NA")} textStyle={{ whiteSpace: "pre" }} />
            <Row className="border-none"  label={t("WS_PLUMBER_LIC_NO")} text={data?.WaterConnection?.[0]?.plumberInfo?.licenseNo} textStyle={{ whiteSpace: "pre" }} />
            <Row className="border-none"  label={t("WS_ADDN_DETAILS_PLUMBER_NAME_LABEL")} text={data?.WaterConnection?.[0]?.plumberInfo?.name || "NA"} textStyle={{ whiteSpace: "pre" }} />
            <Row className="border-none"  label={t("WS_PLUMBER_MOB_NO")} text={data?.WaterConnection?.[0]?.plumberInfo?.mobileNumber || "NA"} textStyle={{ whiteSpace: "pre" }} />
          </StatusTable>
        </Card>}
        <Card>
          <CardSubHeader>{t("WS_ROAD_CUTTING_DETAILS")}</CardSubHeader>
          <StatusTable>
            <Row className="border-none"  label={t("WS_ADDN_DETAIL_ROAD_TYPE")} text={data?.WaterConnection?.[0]?.roadType || t("NA")} textStyle={{ whiteSpace: "pre" }} />
            <Row className="border-none"  label={t("WS_ADDN_DETAILS_AREA_LABEL")} text={data?.WaterConnection?.[0]?.roadCuttingArea} textStyle={{ whiteSpace: "pre" }} />
          </StatusTable>
        </Card>
        <Card>
          <CardSubHeader>{t("WS_ACTIVATION_DETAILS")}</CardSubHeader>
          <StatusTable>
            <Row className="border-none"  label={t("WS_SERV_DETAIL_CONN_EXECUTION_DATE")} text={data?.WaterConnection?.[0]?.dateEffectiveFrom || t("NA")} textStyle={{ whiteSpace: "pre" }} />
            <Row className="border-none"  label={t("WS_SERV_DETAIL_METER_ID")} text={data?.WaterConnection?.[0]?.meterId} textStyle={{ whiteSpace: "pre" }} />
            <Row className="border-none"  label={t("WS_ADDN_DETAIL_METER_INSTALL_DATE")} text={data?.WaterConnection?.[0]?.meterInstallationDate || "NA"} textStyle={{ whiteSpace: "pre" }} />
            <Row className="border-none"  label={t("WS_ADDN_DETAILS_INITIAL_METER_READING")} text={data?.WaterConnection?.[0]?.additionalDetails?.initialMeterReading || "NA"} textStyle={{ whiteSpace: "pre" }} />
          </StatusTable>
        </Card>
      </div>
    </React.Fragment>
  );
};

export default WSAdditionalDetails;