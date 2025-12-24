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

export const getMedias = ({
  apiUrl,
  token,
  limit,
  offset = 0,
  type,
  communityId,
  filterBy,
  allowedMediaTypes = ["IMAGE", "VIDEO", "PPT", "PDF"],
  lng,
  isFavorite = 0,
}) => {
  let fields = [
    "*",
    "meta",
    "webPath",
    "title",
    "description",
    "preview",
    "tags",
    "creator",
    "taggedUsers",
    "social",
    "organization",
  ];

  let filter = [];

  if (communityId) {
    filter.push({
      property: "organization",
      operator: "eq",
      value: communityId,
    });
  } else {
    fields.push("organization");
  }

  filter.push({
    property: "languages",
    operator: "flike",
    value: lng,
  });

  if (type) {
    if (type === "MASK" || type === "LOGO") {
      filter.push({
        property: "objectType",
        operator: "eq",
        value: type,
      });
    } else {
      filter.push({
        property: "objectType",
        operator: "nin",
        value: ["LOGO", "MASK"],
      });

      if (type.toUpperCase() !== "ALL") {
        if (type === "DOC") {
          const docType = [];
          if (allowedMediaTypes.includes("PDF")) docType.push("PDF");
          if (allowedMediaTypes.includes("PPT")) docType.push("PPT");
          filter.push({
            property: "docType",
            operator: "in",
            value: docType.length > 0 ? docType : ["NOT_ALLOWED_TYPE"],
          });
        } else {
          filter.push({
            property: "docType",
            operator: "in",
            value: allowedMediaTypes.includes(type)
              ? [type]
              : ["NOT_ALLOWED_TYPE"],
          });
        }
      } else {
        filter.push({
          property: "docType",
          operator: "in",
          value:
            allowedMediaTypes.length > 0
              ? allowedMediaTypes
              : ["NOT_ALLOWED_TYPE"],
        });
      }
    }
  }

  if (filterBy && filterBy.type) {
    if (filterBy.type.toUpperCase() !== "ALL") {
      if (filterBy.type === "DOC") {
        filter.push({
          property: "docType",
          operator: "in",
          value:
            allowedMediaTypes.includes("PDF") &&
            allowedMediaTypes.includes("PPT")
              ? ["PDF", "PPT"]
              : ["NOT_ALLOWED_TYPE"],
        });
      } else {
        filter.push({
          property: "docType",
          operator: "in",
          value: allowedMediaTypes.includes(filterBy.type)
            ? [filterBy.type]
            : ["NOT_ALLOWED_TYPE"],
        });
      }
    } else if (filterBy.type.toUpperCase() === "ALL") {
      filter.push({
        property: "docType",
        operator: "in",
        value:
          allowedMediaTypes.length > 0
            ? allowedMediaTypes
            : ["NOT_ALLOWED_TYPE"],
      });
    }
    filter.push({
      property: "objectType",
      operator: "nin",
      value: ["LOGO", "MASK"],
    });
  }

  if (filterBy && filterBy.search) {
    filter.push({
      property: `title${lng.charAt(0).toUpperCase() + lng.slice(1)}`,
      operator: "like",
      value: filterBy.search,
    });
  }

  if (filterBy && filterBy.tags && filterBy.tags.length > 0) {
    filter.push({
      property: "tag.id",
      operator: "in",
      value: filterBy.tags.map((tag) => tag.id),
    });
  }

  if (filterBy && filterBy.creator) {
    filter.push({
      property: "creator",
      operator: "eq",
      value: filterBy.creator.id,
    });
  }
  if (filterBy && filterBy.category) {
    filter.push({
      property: "category.id",
      operator: "eq",
      value: filterBy.category.id,
    });
  }

  if (filterBy && filterBy.isPrivate) {
    filter.push({
      property: "isPrivate",
      operator: Array.isArray(filterBy.isPrivate) ? "in" : "eq",
      value: filterBy.isPrivate,
    });
  } else {
    filter.push({
      property: "isPrivate",
      operator: "eq",
      value: "0",
    });
  }

  if (filterBy && filterBy.inTheNews) {
    filter.push({
      property: "inTheNews",
      operator: "eq",
      value: filterBy.inTheNews,
    });
  }

  const sort = [
    {
      property: "createdAt",
      dir: "desc",
    },
  ];

  const requestUrl = `${apiUrl}/media/media${
    isFavorite === 1 ? "/favorite" : ""
  }`;

  return axios.get(requestUrl, {
    params: {
      access_token: token,
      filter: JSON.stringify(filter),
      sort: JSON.stringify(sort),
      fields: fields.join(","),
      limit,
      start: offset,
      workspace: "ua",
    },
  });
};
