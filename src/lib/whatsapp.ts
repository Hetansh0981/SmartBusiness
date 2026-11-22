/**
 * WhatsApp Normalization & Link Utility for DukaanOS
 */

/**
 * Validates and normalizes an Indian phone number to international E.164 format (without +)
 * Expected inputs:
 *  - 10 digits starting with 6, 7, 8, or 9 (e.g. "9876543210")
 *  - 12 digits starting with 91 followed by 6, 7, 8, or 9 (e.g. "919876543210")
 *  - Formatted strings (e.g. "+91 98765-43210" or "09876543210")
 */
export function normalizeWhatsAppNumber(rawNumber: string): string | null {
  if (!rawNumber) return null;

  // 1. Strip all non-digit characters
  let digits = rawNumber.replace(/\D/g, '');

  // 2. Remove leading '0' if 11 digits (e.g., STD trunk prefix 09876543210)
  if (digits.length === 11 && digits.startsWith('0')) {
    digits = digits.slice(1);
  }

  // 3. Handle 10-digit Indian mobile numbers (starts with 6, 7, 8, or 9)
  if (/^[6-9]\d{9}$/.test(digits)) {
    return `91${digits}`;
  }

  // 4. Handle 12-digit numbers already prefixed with 91
  if (/^91[6-9]\d{9}$/.test(digits)) {
    return digits;
  }

  // 5. Invalid number format
  return null;
}

/**
 * Generates a validated wa.me link with safe URL encoding
 * Returns null if the phone number is invalid.
 */
export function getValidWhatsAppUrl(
  phoneNumber: string,
  messageText: string
): string | null {
  const normalizedNumber = normalizeWhatsAppNumber(phoneNumber);
  if (!normalizedNumber) {
    return null;
  }

  return `https://wa.me/${normalizedNumber}?text=${encodeURIComponent(messageText)}`;
}

/**
 * Formats a phone number for display (e.g. "+91 98765 43210")
 */
export function formatPhoneNumber(rawNumber: string): string {
  const normalized = normalizeWhatsAppNumber(rawNumber);
  if (!normalized) {
    return rawNumber;
  }
  // 91XXXXXXXXXX -> +91 XXXXX XXXXX
  const local = normalized.slice(2);
  return `+91 ${local.slice(0, 5)} ${local.slice(5)}`;
}
