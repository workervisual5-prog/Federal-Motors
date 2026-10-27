import { track } from '@/scripts/analytics';

// Inquiry forms. Two delivery modes, chosen at build time (see InquiryForm.astro):
//  - "email": send through EmailJS; the lead event fires only when EmailJS returns 200.
//  - "whatsapp": validate, then open WhatsApp with the request pre-filled. Not counted as a lead,
//    because we can't know whether the visitor pressed Send.

const EMAILJS_URL = 'https://api.emailjs.com/api/v1.0/email/send';
const MESSAGES: Record<string, string> = {
  valueMissing: 'Please fill in this field.',
  typeMismatch: 'Please check the format.',
  patternMismatch: 'Please enter a valid Pakistani mobile number, e.g. 0300-1234567.',
  rangeUnderflow: 'This value is too low.',
  rangeOverflow: 'This value is too high.',
  tooLong: 'This is too long.',
};

type Control = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

function errorFor(el: Control) {
  const v = el.validity;
  for (const k of Object.keys(MESSAGES)) if (v[k as keyof ValidityState]) return MESSAGES[k];
  return '';
}

function show(el: Control) {
  const box = el.closest('[data-field]')?.querySelector<HTMLElement>('[data-error]');
  const msg = errorFor(el);
  el.setAttribute('aria-invalid', msg ? 'true' : 'false');
  if (box) {
    box.textContent = msg;
    box.classList.toggle('hidden', !msg);
  }
  return !msg;
}

/** What the visitor actually saw and entered: [label, value, field name] for each filled field. */
function filledFields(form: HTMLFormElement, controls: Control[]) {
  const rows: [string, string, string][] = [];
  const vehicle = form.querySelector<HTMLInputElement>('input[type=hidden][name=vehicle]')?.value;
  if (vehicle) rows.push(['Vehicle', vehicle, 'vehicle']);
  for (const el of controls) {
    if (!el.value.trim()) continue;
    const label = form.querySelector(`label[for="${el.id}"]`)?.firstChild?.textContent?.trim() ?? el.name;
    const value = el instanceof HTMLSelectElement ? el.selectedOptions[0]?.text ?? el.value : el.value.trim();
    rows.push([label, value, el.name]);
  }
  return rows;
}

function whatsappText(form: HTMLFormElement, controls: Control[]) {
  const lines = [`Assalamualaikum Federal Motors — ${form.dataset.label} from your website:`, ''];
  for (const [label, value] of filledFields(form, controls)) lines.push(`${label}: ${value}`);
  return lines.join('\n');
}

/** EmailJS template variables. Every field is also available by its own name, e.g. {{phone}}. */
function emailParams(form: HTMLFormElement, controls: Control[]) {
  const rows = filledFields(form, controls);
  const params: Record<string, string> = {
    form_title: form.dataset.label ?? 'Website inquiry',
    form_name: form.getAttribute('name') ?? '',
    page_url: location.href,
    submitted_at: new Date().toLocaleString('en-PK', { timeZone: 'Asia/Karachi', dateStyle: 'medium', timeStyle: 'short' }),
    fields: rows.map(([label, value]) => `${label}: ${value}`).join('\n'),
  };
  for (const [, value, name] of rows) params[name] = value;
  params.from_name = params.name ?? '';
  params.reply_to = params.email ?? '';
  return params;
}

document.querySelectorAll<HTMLFormElement>('form[data-inquiry-form]:not([data-ready])').forEach((form) => {
  form.dataset.ready = '';
  const wrap = form.closest('[data-form-wrap]')!;
  const controls = () => Array.from(form.querySelectorAll<Control>('[data-field] input, [data-field] select, [data-field] textarea'));

  for (const el of controls()) {
    el.addEventListener('blur', () => el.value && show(el));
    el.addEventListener('input', () => el.getAttribute('aria-invalid') === 'true' && show(el));
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const errorBox = form.querySelector<HTMLElement>('[data-form-error]')!;
    errorBox.classList.add('hidden');

    const invalid = controls().filter((el) => !show(el));
    if (invalid.length) {
      invalid[0].focus();
      return;
    }
    // Honeypot filled in: almost certainly a bot. Do nothing.
    if ((form.elements.namedItem('company') as HTMLInputElement | null)?.value) return;

    const params = JSON.parse(form.dataset.trackParams || '{}');
    const formName = form.getAttribute('name')!;

    if (form.dataset.mode === 'whatsapp') {
      const url = `https://wa.me/${form.dataset.whatsapp}?text=${encodeURIComponent(whatsappText(form, controls()))}`;
      window.open(url, '_blank', 'noopener');
      track('whatsapp_click', { source: `${formName}_form`, form_name: formName, ...params });
      const handoff = wrap.querySelector<HTMLElement>('[data-form-handoff]')!;
      handoff.querySelector<HTMLAnchorElement>('[data-handoff-link]')!.href = url;
      form.classList.add('hidden');
      handoff.classList.remove('hidden');
      handoff.focus();
      return;
    }

    const button = form.querySelector<HTMLButtonElement>('[data-submit]')!;
    const label = form.querySelector<HTMLElement>('[data-submit-label]')!;
    const original = label.textContent;
    button.disabled = true;
    label.textContent = 'Sending…';
    try {
      const cfg = JSON.parse(form.dataset.emailjs!) as { publicKey: string; serviceId: string; templateId: string };
      const res = await fetch(EMAILJS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: cfg.serviceId,
          template_id: cfg.templateId,
          user_id: cfg.publicKey,
          template_params: emailParams(form, controls()),
        }),
      });
      if (!res.ok) throw new Error(`EmailJS ${res.status}`);
      // Only a confirmed submission counts as a conversion.
      track(form.dataset.event!, { form_name: formName, ...params });
      form.classList.add('hidden');
      const ok = wrap.querySelector<HTMLElement>('[data-form-success]')!;
      ok.classList.remove('hidden');
      ok.focus();
    } catch {
      errorBox.classList.remove('hidden');
    } finally {
      button.disabled = false;
      label.textContent = original;
    }
  });
});
