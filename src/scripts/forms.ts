import { track } from '@/scripts/analytics';

// Progressive enhancement for Netlify Forms. Without JS the form still posts natively.
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

document.querySelectorAll<HTMLFormElement>('form[data-netlify-form]:not([data-ready])').forEach((form) => {
  form.dataset.ready = '';
  const controls = () => Array.from(form.querySelectorAll<Control>('[data-field] input, [data-field] select, [data-field] textarea'));

  for (const el of controls()) {
    el.addEventListener('blur', () => el.value && show(el));
    el.addEventListener('input', () => el.getAttribute('aria-invalid') === 'true' && show(el));
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const wrap = form.closest('[data-form-wrap]')!;
    const errorBox = form.querySelector<HTMLElement>('[data-form-error]')!;
    const button = form.querySelector<HTMLButtonElement>('[data-submit]')!;
    const label = form.querySelector<HTMLElement>('[data-submit-label]')!;
    errorBox.classList.add('hidden');

    const invalid = controls().filter((el) => !show(el));
    if (invalid.length) {
      invalid[0].focus();
      return;
    }

    const original = label.textContent;
    button.disabled = true;
    label.textContent = 'Sending…';
    try {
      const body = new URLSearchParams(new FormData(form) as unknown as Record<string, string>).toString();
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      // Only a confirmed submission counts as a conversion.
      const params = JSON.parse(form.dataset.trackParams || '{}');
      track(form.dataset.event!, { form_name: form.getAttribute('name')!, ...params });
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
