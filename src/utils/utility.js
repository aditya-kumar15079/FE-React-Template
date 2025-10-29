import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import utc from "dayjs/plugin/utc.js";

dayjs.extend(customParseFormat);
dayjs.extend(utc);

export const uuidv4 = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID(); // RFC 4122 v4
  }
  return uuidv4Polyfill();
};

function uuidv4Polyfill() {
  // Get 16 random bytes (Uint8Array in browser, Buffer in Node)
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);

  // per RFC 4122
  bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant

  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");

  return hex.slice(0, 8) + "-" + hex.slice(8, 12) + "-" + hex.slice(12, 16) + "-" + hex.slice(16, 20) + "-" + hex.slice(20);
}

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
