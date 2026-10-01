/**
 * Centralized WhatsApp Configuration & Utilities
 * Single source of truth for Kishore's WhatsApp contact experience.
 */

export const WHATSAPP_CONFIG = {
  // Raw 10-digit number
  rawNumber: '8838635463',
  // Country code for India (no +, no leading zeros)
  countryCode: '91',
  // Pre-filled message that can be edited by the visitor before sending
  defaultMessage: 'Hi Kishore, I found your portfolio and would like to connect with you.',
};

/**
 * Returns sanitized international phone number without +, spaces, hyphens, or brackets.
 */
export function getSanitizedPhoneNumber(phone = WHATSAPP_CONFIG.rawNumber) {
  const digits = String(phone).replace(/\D/g, '');
  if (digits.length === 10) {
    return `${WHATSAPP_CONFIG.countryCode}${digits}`;
  }
  return digits;
}

/**
 * Generates official click-to-chat WhatsApp URL:
 * https://wa.me/[NUMBER]?text=[ENCODED_MESSAGE]
 */
export function getWhatsAppUrl(
  phone = WHATSAPP_CONFIG.rawNumber,
  message = WHATSAPP_CONFIG.defaultMessage
) {
  const sanitizedNumber = getSanitizedPhoneNumber(phone);
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${sanitizedNumber}?text=${encodedMessage}`;
}

/**
 * Formatted display number for UI readability
 */
export function getFormattedDisplayNumber(phone = WHATSAPP_CONFIG.rawNumber) {
  const digits = String(phone).replace(/\D/g, '');
  if (digits.length === 10) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  return phone;
}
