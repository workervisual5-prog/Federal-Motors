import { track } from '@/scripts/analytics';

// ---- Scroll reveal (one shared observer, no scroll listeners) -------------
const revealables = document.querySelectorAll<HTMLElement>('[data-reveal]');
if ('IntersectionObserver' in window && revealables.length) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );
  revealables.forEach((el) => io.observe(el));
} else {
  revealables.forEach((el) => el.classList.add('is-visible'));
}

// ---- Sticky header state (sentinel instead of scroll listener) ------------
const header = document.querySelector<HTMLElement>('[data-header]');
const sentinel = document.querySelector('[data-header-sentinel]');
if (header && sentinel) {
  new IntersectionObserver(([e]) => header.toggleAttribute('data-scrolled', !e.isIntersecting)).observe(sentinel);
}

// ---- Mobile menu -----------------------------------------------------------
const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
const menu = document.querySelector<HTMLElement>('[data-menu]');
if (toggle && menu) {
  const focusables = () => menu.querySelectorAll<HTMLElement>('a, button');
  const setOpen = (open: boolean) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.toggleAttribute('data-open', open);
    menu.inert = !open;
    document.documentElement.style.overflow = open ? 'hidden' : '';
    if (open) focusables()[0]?.focus();
  };
  menu.inert = true;
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  menu.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', (e) => {
    if (toggle.getAttribute('aria-expanded') !== 'true') return;
    if (e.key === 'Escape') {
      setOpen(false);
      toggle.focus();
    }
    if (e.key === 'Tab') {
      const items = [toggle, ...focusables()];
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
  matchMedia('(min-width: 1024px)').addEventListener('change', (m) => m.matches && setOpen(false));
}

// ---- Analytics: one delegated listener for every [data-track] element ------
document.addEventListener('click', (e) => {
  const el = (e.target as HTMLElement).closest<HTMLElement>('[data-track]');
  if (!el) return;
  const params: Record<string, string> = { page_location: location.href };
  for (const [k, v] of Object.entries(el.dataset)) {
    if (k.startsWith('track') && k !== 'track' && v) {
      const key = k.slice(5).replace(/[A-Z]/g, (c) => '_' + c.toLowerCase()).replace(/^_/, '');
      params[key] = v;
    }
  }
  track(el.dataset.track!, params);
});
