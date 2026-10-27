// EmailJS settings for all inquiry forms. These values are public by design (they run in the browser).
// Find them at https://dashboard.emailjs.com: Account → Public key, Email Services → Service ID,
// Email Templates → Template ID. Environment variables with the same names override them.
//
// Until serviceId and templateId are filled in, forms fall back to WhatsApp mode.
export const emailjs = {
  publicKey: (import.meta.env.PUBLIC_EMAILJS_PUBLIC_KEY as string | undefined) || 'Mxg4xyKr6kadST5vs',
  serviceId: (import.meta.env.PUBLIC_EMAILJS_SERVICE_ID as string | undefined) || '',
  templateId: (import.meta.env.PUBLIC_EMAILJS_TEMPLATE_ID as string | undefined) || '',
};

export const emailjsReady = Boolean(emailjs.publicKey && emailjs.serviceId && emailjs.templateId);
