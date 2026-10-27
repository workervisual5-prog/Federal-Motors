// EmailJS settings for all inquiry forms. These values are public by design (they run in the browser).
// Find them at https://dashboard.emailjs.com: Account → Public key, Email Services → Service ID,
// Email Templates → Template ID. Environment variables with the same names override them.
//
// If serviceId or templateId is emptied, forms fall back to WhatsApp mode.
export const emailjs = {
  publicKey: (import.meta.env.PUBLIC_EMAILJS_PUBLIC_KEY as string | undefined) || 'Mxg4xyKr6kadST5vs',
  serviceId: (import.meta.env.PUBLIC_EMAILJS_SERVICE_ID as string | undefined) || 'service_yk7noqn',
  templateId: (import.meta.env.PUBLIC_EMAILJS_TEMPLATE_ID as string | undefined) || 'template_phpkiwo',
};

export const emailjsReady = Boolean(emailjs.publicKey && emailjs.serviceId && emailjs.templateId);
