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

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID?.trim() || '12n3chc1';
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || 'production';

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2025-01-01',
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN,
});

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
