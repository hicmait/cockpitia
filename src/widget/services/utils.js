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
