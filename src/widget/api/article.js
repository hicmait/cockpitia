import axios from "axios";

import {
  getRequestCancellationToken,
  getRequestConfig,
  generateCancellationTokenSource,
  throwCatchedError,
} from "../services/axiosUtils";

let getSearchResultsCTS;
let getEventSearchCTS;
let getTagSearchResultsCTS;

export const tamtamIt = (apiUrl, token, url) => {
  const requestUrl = `${apiUrl}/blog/parser/parse`;

  var formData = new FormData();
  formData.append("access_token", token);
  formData.append("url", url);

  return axios.post(requestUrl, formData);
};

export const fetchSearch = (blogSearchUrl, word, language, orgs) => {
  let cancellationTokenSource = generateCancellationTokenSource();

  let requestCancellationToken = getRequestCancellationToken(
    getSearchResultsCTS,
    cancellationTokenSource
  );
  getSearchResultsCTS = cancellationTokenSource;

  let requestUrl = `${blogSearchUrl}`;

  let params = {
    lng: language,
    keyword: word,
    isExternal: 0,
    org: orgs,
    size: 20,
  };

  let requestConfig = getRequestConfig(params, requestCancellationToken);

  return axios.get(requestUrl, requestConfig).catch(function (thrown) {
    throwCatchedError(thrown);
  });
};

export const getEvents = async (apiUrl, params) => {
  const requestUrl = `${apiUrl}/event/event/get-events`;

  let cancellationTokenSource = generateCancellationTokenSource();

  let requestCancellationToken = getRequestCancellationToken(
    getEventSearchCTS,
    cancellationTokenSource
  );
  getEventSearchCTS = cancellationTokenSource;

  const fields = [
    "id",
    "type",
    "nameFr",
    "nameNl",
    "nameEn",
    "placeFr",
    "placeNl",
    "placeEn",
    "descriptionFr",
    "descriptionNl",
    "descriptionEn",
    "urlBannerFr",
    "urlBannerNl",
    "urlBannerEn",
    "eventDate",
    "slotsCount",
    "client",
    "memberPrice",
    "nonMemberPrice",
    "languages",
    "isReplayable",
    "accreditationHours",
    "status",
    "replayStatus",
    "labelFr",
    "labelNl",
    "labelEn",
    "tag",
    "playProgress",
    "fullWatch",
    "eventClassificationRank",
    "question",
    "isMultiDate",
    "isVirtual",
    "playProgress",
    "isCertificateNotIncluded",
    "certificateStatus",
    "slotReplayUrls",
    "stages",
    "template",
    "configBag",
    "isOnlyByCycle",
    "callToActionFr",
    "callToActionNl",
    "callToACtionEn",
    "maxNumber",
    "guestCount",
    "eventPlace",
    "isSoldOut",
    "isIncludedPremium",
    "speakers-abstract",
    "user-registered",
    "eventCycles",
    "eventDates",
    "place",
  ];

  const finalParams = {
    ...params,
    fields: fields.join(","),
  };

  let requestConfig = getRequestConfig(finalParams, requestCancellationToken);

  return axios.get(requestUrl, requestConfig).catch(function (thrown) {
    throwCatchedError(thrown);
  });
};
