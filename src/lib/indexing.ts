// Search engines may index only the live production site.
// PUBLIC_ALLOW_INDEXING="true"/"false" overrides; otherwise Vercel production builds are indexable,
// and preview deployments and local builds are not.
const override = import.meta.env.PUBLIC_ALLOW_INDEXING as string | undefined;

export const allowIndexing =
  override === 'true' ? true : override === 'false' ? false : process.env.VERCEL_ENV === 'production';
