import { business } from '@/data/business';

export const whatsappMessages = {
  general: 'Assalamualaikum Federal Motors, I would like more information about your showroom.',
  financing: 'Assalamualaikum Federal Motors, I would like information about car financing assistance.',
  exchange: 'Assalamualaikum Federal Motors, I would like to exchange my current vehicle.',
  sell: 'Assalamualaikum Federal Motors, I would like to sell my car.',
  sourcing: 'Assalamualaikum Federal Motors, I am looking for a specific vehicle that is not in your current stock.',
  visit: 'Assalamualaikum Federal Motors, I would like to book a visit to your showroom.',
} as const;

export function vehicleMessage(title: string, stockReference: string) {
  return `Assalamualaikum Federal Motors, I am interested in the ${title} (Ref: ${stockReference}) listed on your website. Please share availability and details.`;
}

export function whatsappUrl(message: string) {
  return `https://wa.me/${business.whatsapp.number}?text=${encodeURIComponent(message)}`;
}

export function telUrl(e164: string) {
  return `tel:${e164}`;
}

/** HTML pattern for Pakistani mobile numbers: 03001234567, 0300-1234567, +92 300 1234567. */
export const PHONE_PATTERN = '(\\+92|0092|0)[\\s\\-]?3\\d{2}[\\s\\-]?\\d{7}';
