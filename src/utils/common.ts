/** Reusable regex patterns shared across the admin app */
export const REGEX = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PHONE: /^[6-9]\d{9}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
  OTP: /^\d{6}$/,
};

/** Returns an error message string, or "" if valid */
export function validatePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "Phone number is required";
  if (!REGEX.PHONE.test(digits)) return "Enter a valid 10-digit Indian mobile number (starts with 6\u20139)";
  return "";
}
