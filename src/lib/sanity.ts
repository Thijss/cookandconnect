import { createClient } from '@sanity/client';
import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url';
import type { TypedObject } from '@portabletext/astro/types';

export interface SanityPage {
  title: string;
  description: string;
  slug: string;
  tagline?: string;
  body: TypedObject[];
  poster?: {
    asset: SanityImageSource;
    alt?: string;
  } | null;
}

export interface SanityPageLink {
  title: string;
  slug: string;
}

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID?.trim() || '12n3chc1';
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || 'production';

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2025-01-01',
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN,
});

const navigationOrder = ['home', 'become-a-host', 'join-a-dinner', 'join-the-team', 'event', 'about'];

export async function getNavigationPages(): Promise<SanityPageLink[]> {
  const pages = await client.fetch<SanityPageLink[]>(
    `*[_type == "page" && defined(slug.current)]{
      title,
      "slug": slug.current
    }`,
  );
  const seenSlugs = new Set<string>();

  for (const page of pages) {
    if (seenSlugs.has(page.slug)) {
      throw new Error(`The Sanity dataset "${dataset}" contains duplicate page slug "${page.slug}".`);
    }

    seenSlugs.add(page.slug);
  }

  return pages.sort((a, b) => {
    const aOrder = navigationOrder.indexOf(a.slug);
    const bOrder = navigationOrder.indexOf(b.slug);

    if (aOrder !== -1 || bOrder !== -1) {
      if (aOrder === -1) return 1;
      if (bOrder === -1) return -1;
      return aOrder - bOrder;
    }

    return a.title.localeCompare(b.title);
  });
}

export async function getPage(slug: string): Promise<SanityPage> {
  const page = await client.fetch<SanityPage | null>(
    `*[_type == "page" && slug.current == $slug][0]{
      title,
      description,
      "slug": slug.current,
      tagline,
      body,
      poster {asset, alt}
    }`,
    { slug },
  );

  if (!page) {
    throw new Error(
      `The Sanity dataset "${dataset}" does not contain a page with slug "${slug}". Run npm run sanity:seed to add the starter pages.`,
    );
  }

  return page;
}

export function getSanityImageUrl(source: SanityImageSource, width: number): string {
  return createImageUrlBuilder(client).image(source).width(width).auto('format').url();
}
