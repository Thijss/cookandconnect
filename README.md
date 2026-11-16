# Cook & Connect

Astro site with Sanity-managed pages, built as static files for GitHub Pages.

## Set up Sanity (first time)

1. Create a free account at [sanity.io](https://www.sanity.io/) and create a project from the Sanity dashboard. Create a dataset named `production`; choose **Public** read access for the simplest setup.
2. This repository is preconfigured for project ID `12n3chc1` and dataset `production`. If you use another project or dataset, copy `.env.example` to `.env` and update those values. `.env` is ignored by Git.
3. In the Sanity project settings, create an API token with **Editor** permissions. Keep it private; do not commit or share it. Create an ignored `.env.local` file containing the token:

   ```sh
   SANITY_API_WRITE_TOKEN=your-editor-token
   ```

   Run the one-time import, then delete `.env.local`:

   ```sh
   npm run sanity:seed
   rm .env.local
   ```

   This creates the six current site pages and uploads the event poster. Existing page records are left unchanged if the command is run again.
4. Sign in to the Sanity CLI and start the editor:

   ```sh
   npx sanity login
   npm run studio
   ```

   Open the local URL printed by the command (usually `http://localhost:3333`). Edit and publish pages there. The URL slugs must remain `home`, `about`, `become-a-host`, `event`, `join-a-dinner`, and `join-the-team`.
5. To host the editor on Sanity instead of running it locally, use `npm run studio:deploy` after logging in. Sanity will provide a hosted Studio URL.

## Run and build locally

Use Node.js 22.12 or newer. Install dependencies, configure `.env` as above, and then run:

```sh
npm ci
npm run dev
```

`npm run check` checks Astro components. `npm run build` fetches every required page from Sanity and fails with a specific message if the project settings or a page are missing. This site intentionally has no local page-content fallback.

## Deploy to GitHub Pages

1. Push the repository to GitHub on the `main` branch.
2. In **Settings → Secrets and variables → Actions → Variables**, add:
   - `SANITY_PROJECT_ID`: the Sanity project ID.
   - `SANITY_DATASET`: the dataset name (usually `production`).
3. For a public dataset, no Sanity read token is needed. For a private dataset, add `SANITY_API_READ_TOKEN` under **Actions → Secrets**. Content rendered into a static site is public to site visitors even if it is fetched with a private read token.
4. In **Settings → Pages**, select **GitHub Actions** as the build and deployment source.
5. Push to `main`, or open **Actions → Deploy to GitHub Pages → Run workflow** to rebuild after publishing content in Sanity. The workflow derives the correct `/repository-name/` path for a project site.

For a custom domain or a different path, add the Actions variable `ASTRO_BASE_PATH` (use `/` for a root domain, or a path ending in `/`). You can optionally set `ASTRO_SITE_URL` to the canonical site origin.

The Sanity project ID and dataset are public configuration, not secrets. Never commit API tokens. If Sanity content changes, run the workflow manually to publish the updated static site.
