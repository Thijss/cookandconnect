import { defineCliConfig } from 'sanity/cli';

const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID ||
  process.env.PUBLIC_SANITY_PROJECT_ID ||
  '12n3chc1';

export default defineCliConfig({
  api: {
    projectId,
    dataset: process.env.PUBLIC_SANITY_DATASET || 'production',
  },
});
