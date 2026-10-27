// GA4 event helper. A no-op until PUBLIC_GA4_ID is configured and the visitor allows analytics.
// Never pass personal data (names, phone numbers, emails, documents) as parameters.

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export type TrackEvent =
  | 'whatsapp_click'
  | 'phone_click'
  | 'book_visit_click'
  | 'test_drive_request'
  | 'generate_lead'
  | 'vehicle_inquiry'
  | 'financing_inquiry'
  | 'sell_car_inquiry'
  | 'search'
  | 'view_item'
  | 'directions_click';

const BLOCKED_KEYS = /name|phone|email|mobile|cnic|address|message/i;

export function track(event: TrackEvent | string, params: Record<string, string | number> = {}) {
  if (typeof window.gtag !== 'function') return;
  const safe = Object.fromEntries(Object.entries(params).filter(([k]) => !BLOCKED_KEYS.test(k)));
  window.gtag('event', event, safe);
}
