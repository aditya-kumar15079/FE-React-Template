import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import utc from "dayjs/plugin/utc.js";

dayjs.extend(customParseFormat);
dayjs.extend(utc);

// Define all possible input formats you expect
const SUPPORTED_FORMATS = [
  "DDMMYYYY HH:mm:ss", // e.g. 02092025 07:20:31
  "DD/MM/YYYY HH:mm:ss", // e.g. 02/09/2025 07:20:31
  "YYYY-MM-DDTHH:mm:ss", // e.g. 2025-09-02T07:20:31
];

// Utility function
export const formatDate = (input, targetFormat = "MM/DD/YYYY hh:mm:ss A") => {
  for (const fmt of SUPPORTED_FORMATS) {
    const parsed = dayjs.utc(input, fmt, true); // strict parsing
    if (parsed.isValid()) {
      return parsed.local().format(targetFormat);
    }
  }
  return "Invalid date"; // fallback
};

export const dateComparator = (datekey, ascending=true) =>(a, b) => {
  const dateA = formatDate(a?.[datekey]);
  const dateB = formatDate(b?.[datekey]);
  return ascending ? new Date(dateA) - new Date(dateB) : new Date(dateB) - new Date(dateA);
};
