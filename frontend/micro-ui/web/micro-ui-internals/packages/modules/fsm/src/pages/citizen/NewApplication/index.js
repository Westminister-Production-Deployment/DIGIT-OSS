import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Redirect, Route, BrowserRouter as Router, Switch, useHistory, useRouteMatch, useLocation } from "react-router-dom";
import { TypeSelectCard, Loader } from "@egovernments/digit-ui-react-components";
import { newConfig } from "../../../config/NewApplication/config";
import CheckPage from "./CheckPage";
import Response from "./Response";
import { useQueryClient } from "react-query";

const FileComplaint = ({ parentRoute }) => {
  const queryClient = useQueryClient();
  const match = useRouteMatch();
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const history = useHistory();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateId = Digit.ULBService.getStateId();
  let config = [];
  let configs = []
  const [params, setParams, clearParams] = Digit.Hooks.useSessionStorage("FSM_CITIZEN_FILE_PROPERTY", {});
  const { data: commonFields, isLoading } = Digit.Hooks.fsm.useMDMS(stateId, "FSM", "CommonFieldsConfig");

  const [mutationHappened, setMutationHappened, clear] = Digit.Hooks.useSessionStorage("FSM_MUTATION_HAPPENED", false);
  const [errorInfo, setErrorInfo, clearError] = Digit.Hooks.useSessionStorage("FSM_ERROR_DATA", false);
  const [successData, setsuccessData, clearSuccessData] = Digit.Hooks.useSessionStorage("FSM_MUTATION_SUCCESS_DATA", false);

  useEffect(() => {
    if (!pathname?.includes('new-application/response')) {
      setMutationHappened(false);
      clearSuccessData();
      clearError();
    }
  }, []);

  const goNext = (skipStep) => {
    const currentPath = pathname.split("/").pop();
    const { nextStep } = configs.find((routeObj) => routeObj.route === currentPath);
    let redirectWithHistory = history.push;
    if (skipStep) {
      redirectWithHistory = history.replace;
    }
    if (nextStep === null) {
      return redirectWithHistory(`${parentRoute}/new-application/check`);
    }
    redirectWithHistory(`${match.path}/${nextStep}`);
  };

  const submitComplaint = async () => {
    history.push(`${parentRoute}/new-application/response`);
  };

  function handleSelect(key, data, skipStep) {
    setParams({ ...params, ...{ [key]: { ...params[key], ...data } }, ...{ source: "ONLINE" } });
    goNext(skipStep);
  }

  const handleSkip = () => { };

  const handleSUccess = () => {
    clearParams();
    queryClient.invalidateQueries("FSM_CITIZEN_SEARCH");
    setMutationHappened(true);
  };

  if (isLoading) {
    return <Loader />;
  }

  commonFields.forEach((obj) => {
    config = config.concat(obj.body.filter((a) => !a.hideInCitizen));
  });

  const additionalConfig = [{
    "label": "a",
    "isMandatory": true,
    "type": "component",
    "route": "select-trip-number",
    "key": "selectTripNo",
    "component": "SelectTripNo",
    "texts": {
      "headerCaption": "",
      "header": "ES_FSM_NUMBER_OF_TRIPS",
      "cardText": "ES_FSM_NUMBER_OF_TRIPS_TEXT",
      "skipText": "CORE_COMMON_SKIP_CONTINUE",
      "submitBarLabel": "CS_COMMON_NEXT",
    },
    "nextStep": "property-type"
  },
  {
    "label": "a",
    "isMandatory": false,
    "type": "component",
    "route": "select-gender",
    "key": "selectGender",
    "component": "SelectGender",
    "texts": {
      "headerCaption": "",
      "header": "CS_COMMON_CHOOSE_GENDER",
      "cardText": "CS_COMMON_SELECT_GENDER",
      "submitBarLabel": "CS_COMMON_NEXT",
      "skipText": "CORE_COMMON_SKIP_CONTINUE"
    },
    "nextStep": "select-payment-preference"
  },
  {
    "label": "a",
    "isMandatory": false,
    "type": "component",
    "route": "select-payment-preference",
    "key": "selectPaymentPreference",
    "component": "SelectPaymentPreference",
    "texts": {
      "headerCaption": "",
      "header": "ES_FSM_PAYMENT_PREFERENCE_LABEL",
      "cardText": "ES_FSM_PAYMENT_PREFERENCE_TEXT",
      "submitBarLabel": "CS_COMMON_NEXT",
      "skipText": "CORE_COMMON_SKIP_CONTINUE"
    },
    "nextStep": null
  }
  ]

  configs = [...additionalConfig, ...config]
  configs.indexRoute = "select-trip-number";

  return (
    <Switch>
      {configs.map((routeObj, index) => {
        const { component, texts, inputs, key } = routeObj;
        const Component = typeof component === "string" ? Digit.ComponentRegistryService.getComponent(component) : component;
        return (
          <Route path={`${match.path}/${routeObj.route}`} key={index}>
            <Component config={{ texts, inputs, key }} onSelect={handleSelect} onSkip={handleSkip} t={t} formData={params} />
          </Route>
        );
      })}
      <Route path={`${match.path}/check`}>
        <CheckPage onSubmit={submitComplaint} value={params} />
      </Route>
      <Route path={`${match.path}/response`}>
        <Response data={params} onSuccess={handleSUccess} />
      </Route>
      <Route>
        <Redirect to={`${match.path}/${configs.indexRoute}`} />
      </Route>
    </Switch>
  );
};

export default FileComplaint;
