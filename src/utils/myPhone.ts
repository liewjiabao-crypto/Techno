export function sanitizeMyPhoneInput(input: string) {
  return input.replace(/[^\d+]/g, "");
}

export function normalizeMyPhone(input: string) {
  const raw = sanitizeMyPhoneInput(input);
  if (raw.startsWith("+")) return raw;
  return raw;
}

export function isValidMyPhone(input: string) {
  const raw = sanitizeMyPhoneInput(input);
  if (!raw) return false;

  const normalized = raw.startsWith("+60") ? `0${raw.slice(3)}` : raw;

  const digits = normalized.replace(/\D/g, "");
  if (!digits.startsWith("0")) return false;

  return /^0(1\d{8,9}|[3-9]\d{7,8})$/.test(digits);
}

export function phoneErrorMessage(input: string) {
  if (!input.trim()) return "";
  return isValidMyPhone(input) ? "" : "Invalid Malaysian phone number.";
}

