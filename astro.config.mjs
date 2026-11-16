import { defineConfig } from 'astro/config';

const [owner, repository] = process.env.GITHUB_REPOSITORY?.split('/') ?? [];
const isUserOrOrganizationSite =
  repository?.toLowerCase() === `${owner?.toLowerCase()}.github.io`;
const configuredBase = process.env.ASTRO_BASE_PATH?.trim();
const base =
  configuredBase ||
  (process.env.GITHUB_ACTIONS === 'true' && repository && !isUserOrOrganizationSite
    ? `/${repository}/`
    : '/');

export default defineConfig({
  base,
  output: 'static',
  trailingSlash: 'always',
  ...(process.env.ASTRO_SITE_URL ? { site: process.env.ASTRO_SITE_URL } : {}),
});
