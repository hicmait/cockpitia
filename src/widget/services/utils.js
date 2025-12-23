import moment from "moment-timezone";
import "moment/locale/fr";
import "moment/locale/nl";

const API_DATE_FORMAT = "YYYY-MM-DD HH:mm:ss";

export const getDateByLang = (date, lng, shortMonth = false) => {
  if (!date) {
    return "";
  }

  let datePartFormat = shortMonth ? "ll" : "LL";
  let datetime = moment(date, API_DATE_FORMAT).locale(lng);

  let datePart = datetime.format(datePartFormat);
  let timePart = datetime.format("LT");

  let dateStr = datePart + " à " + timePart;

  return dateStr;
};

export const isServer = !(
  typeof window !== "undefined" &&
  window.document &&
  window.document.createElement
);

export const formatDateFromTo = (
  startDateTime,
  endDateTime,
  I18N,
  language = "fr",
  dateFormat = "ll"
) => {
  if (isEmpty(startDateTime) && isEmpty(endDateTime)) {
    return "";
  }

  if (isEmpty(endDateTime)) {
    return moment(startDateTime).locale(language).format(dateFormat);
  }

  if (isEmpty(startDateTime)) {
    return moment(endDateTime).locale(language).format(dateFormat);
  }

  const startDate = moment(startDateTime).locale(language);
  const endDate = moment(endDateTime).locale(language);
  const isSameYear = startDate.isSame(endDate, "years");
  const isSameDay = startDate.isSame(endDate, "day");
  const isSameMonth = startDate.isSame(endDate, "month");

  if (isSameYear && isSameDay) {
    return `${startDate.format(dateFormat)} ${
      I18N[language]["dateFrom"]
    } ${startDate.format("HH:mm")} ${I18N[language]["timeTo"]} ${endDate.format(
      "HH:mm"
    )}`;
  }

  if (isSameYear && isSameMonth) {
    return `${I18N[language]["dateFrom2"]} ${startDate.format("DD")} ${
      I18N[language]["dateTo"]
    } ${endDate.format(dateFormat)}`;
  }

  if (isSameYear) {
    return `${I18N[language]["dateFrom2"]} ${startDate.format("DD MMM")} ${
      I18N[language]["dateTo"]
    } ${endDate.format(dateFormat)}`;
  }

  return `${I18N[language]["dateFrom2"]} ${startDate.format(dateFormat)} ${
    I18N[language]["dateTo"]
  } ${endDate.format(dateFormat)}`;
};

// export const isEmpty = (value) => {
//   if (Array.isArray(value) || typeof value === "string") {
//     return value.length === 0;
//   }
//   if (typeof value === "object" && value !== null) {
//     return Object.keys(value).length === 0;
//   }
//   return !value;
// };

export function addLandaSize(img, width = 0, height = 0) {
  let result = img;
  let found = false;

  const splt = img.split(".");
  const ext = splt[splt.length - 1];

  if (width > 0) {
    result += `/w${width}`;
    found = true;
  }
  if (height > 0) {
    const sep = width > 0 ? "-" : "/";
    result += `${sep}h${height}`;
    found = true;
  }
  result += found ? "-noEnlarge" : "/noEnlarge";

  return `${result}.${ext}`.replace(
    "https://s3.eu-west-1.amazonaws.com/tamtam",
    "https://s3.tamtam.pro"
  );
}
