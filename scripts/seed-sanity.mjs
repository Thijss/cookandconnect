import { createReadStream } from 'node:fs';
import { access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createClient } from '@sanity/client';

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID || '12n3chc1';
const dataset = process.env.PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!token) {
  throw new Error(
    'Set SANITY_API_WRITE_TOKEN before running npm run sanity:seed.',
  );
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2025-01-01',
  useCdn: false,
  token,
});

let keyNumber = 0;
const nextKey = (prefix) => `${prefix}-${keyNumber++}`;

function span(text, marks = []) {
  return { _type: 'span', _key: nextKey('span'), text, marks };
}

function contentBlock(style, segments, listItem) {
  const markDefs = [];
  const children = segments.map((segment) => {
    if (typeof segment === 'string') return span(segment);
    if (segment.mark === 'strong' || segment.mark === 'em') {
      return span(segment.text, [segment.mark]);
    }
    if (segment.href) {
      const key = nextKey('link');
      markDefs.push({ _type: 'link', _key: key, href: segment.href });
      return span(segment.text, [key]);
    }
    return span(segment.text);
  });

  return {
    _type: 'block',
    _key: nextKey('block'),
    style,
    ...(listItem ? { listItem, level: 1 } : {}),
    markDefs,
    children,
  };
}

const p = (...segments) => contentBlock('normal', segments);
const h2 = (text) => contentBlock('h2', [text]);
const numbered = (...segments) => contentBlock('normal', segments, 'number');
const bulleted = (...segments) => contentBlock('normal', segments, 'bullet');
const strong = (text) => ({ text, mark: 'strong' });
const em = (text) => ({ text, mark: 'em' });
const link = (text, href) => ({ text, href });

const pages = [
  {
    _id: 'page-home',
    _type: 'page',
    title: 'Cook & Connect',
    slug: { _type: 'slug', current: 'home' },
    description:
      'Cook & Connect brings refugees and locals together through shared meals, stories, and friendship in Amsterdam.',
    tagline: 'Where different worlds come together',
    body: [
      p(
        'Cook & Connect brings people together by connecting refugees and locals in a warm, home setting at local people’s homes — to create a more understanding and compassionate world.',
      ),
    ],
  },
  {
    _id: 'page-about',
    _type: 'page',
    title: 'About',
    slug: { _type: 'slug', current: 'about' },
    description:
      'The story and idea behind Cook & Connect, bringing people together through shared meals in Amsterdam.',
    body: [
      p(
        'My name is Sarah, and I started Cook & Connect with a very simple idea. I was reflecting on how this world needs more kindness and more warmth — and that always starts with yourself.',
      ),
      p(
        'We are living in an increasingly individualistic society. Everyone is constantly moving from work to a busy social life. We take care of ourselves and the people we love, but we are losing kindness for the people around us. The elderly woman struggling to carry her groceries.',
      ),
      p(
        'The homeless person sleeping around the corner of your street. The neighbor you always see alone, living a lonely life. And the traumatized refugee in the COA center, who keeps smiling, because what if people might think badly of him?',
      ),
      p(
        'We are so used to this fast-paced life that we forget to look around us. We have become disconnected from something very simple: being connected. The kindness, the care for one another — a smile from a stranger on the street, small talk in the supermarket.',
      ),
      h2('What if we could bring back connection and understanding in an easy, low-key way?'),
      p(
        'Knowing that refugees often cannot cook for themselves — something that is deeply missed — I came up with the idea to connect people. I started looking for hosts in Amsterdam who are willing to open their kitchens for an evening, so we can cook and eat together.',
      ),
      p('A small gesture, but with a big impact.'),
      p(
        'Getting to know people outside your own bubble broadens your perspective and creates understanding. You learn about different cultures and recipes, and you share a meaningful experience — a beautiful evening together. At the same time, you offer something valuable: warmth, humanity, and a sense of home to people who are longing for personal connection and the freedom to cook their own food again — the flavors and smells of their home country.',
      ),
      p('And who knows what comes after? Maybe you can mean more to someone, or a friendship grows. It happens — how beautiful is that?'),
      p('Let’s choose connection instead of polarization and division, and help create a more understanding world.'),
    ],
  },
  {
    _id: 'page-join-a-dinner',
    _type: 'page',
    title: 'Join a dinner',
    slug: { _type: 'slug', current: 'join-a-dinner' },
    description:
      'Join a Cook & Connect dinner and share food, stories, and time with people in Amsterdam.',
    body: [
      p('You are invited to something simple, yet meaningful. Through ', em('Cook & Connect'), ' you will be welcomed into a local home for an evening.'),
      p('Together with others, you will cook a dish from your home country, share a meal, and spend time together.'),
      p("It's a chance to relax, feel at home, and connect with people outside of your daily routine."),
      h2('How it works'),
      numbered(strong('Sign up'), ' — Fill in the ', link('registration form', 'https://forms.gle/GjmXKnk2MjobhSrYA'), '.'),
      numbered(strong('Get matched'), ' — We’ll get in touch with you and match you with a local host in Amsterdam.'),
      numbered(strong('Plan the evening'), ' — Together, we choose a date that works for everyone.'),
      numbered(strong('Get connected'), ' — We create a WhatsApp group with all participants and the host, so you can connect and prepare together.'),
      numbered(strong('Choose what to cook'), ' — Together, you decide on a dish from your home country and make a shopping list.'),
      numbered(strong('The host prepares'), ' — The host takes care of the groceries and opens their home for the evening.'),
      numbered(strong('Cook & connect'), ' — On the day itself, you come together to cook, share a meal, and spend time with each other.'),
      h2('What you can expect'),
      p('You’ll meet new people, share stories, and build real connections.'),
      p('It’s a relaxed evening in a warm, home setting — a space where you can simply be yourself.'),
    ],
  },
  {
    _id: 'page-become-a-host',
    _type: 'page',
    title: 'Become a host',
    slug: { _type: 'slug', current: 'become-a-host' },
    description: 'Open your kitchen and become a Cook & Connect host in Amsterdam.',
    body: [
      p('Join our community and become a host to help to gap the bridge between two worlds.'),
      p('Open up your kitchen for a night, and meet people who would never meet otherwise. Cook together, exchange cultures and build connections.'),
      h2('How it works'),
      numbered(strong('Sign up'), ' — Fill in the ', link('registration form', 'https://forms.gle/2T6DvJvhkpX7NE4D8'), '.'),
      numbered(strong('We get in touch'), ' — We’ll contact you to get to know you and answer any questions you might have.'),
      numbered(strong('Share your availability'), ' — Let us know how many people you can host and when you’re available.'),
      numbered(strong('Get matched'), ' — We match you with a small group that fits your availability.'),
      numbered(strong('Choose the dish'), ' — The group will choose a dish from their home country and create a shopping list.'),
      numbered(strong('Get connected'), ' — A few days before the dinner, we create a WhatsApp group with you and the participants. This is where everyone gets introduced and the shopping list is shared.'),
      numbered(strong('Open your home'), ' — On the agreed date, you welcome the group into your home. Together, you cook, share a meal, and spend the evening connecting.'),
      h2('What it means'),
      p('Hosting is a simple, yet powerful way to make a difference.'),
      p('For many participants, having a place to call home — even for just one evening — is something they deeply miss. Being welcomed into a real home, cooking their own food, and sharing it with others can mean a lot to them.'),
      p('It’s a warm, human experience — a small gesture, with a big impact.'),
    ],
  },
  {
    _id: 'page-event',
    _type: 'page',
    title: 'Cook & Connect Community Event',
    slug: { _type: 'slug', current: 'event' },
    description: 'Join the Cook & Connect community event in Amsterdam on 12 September 2026.',
    body: [
      p('On Saturday, 12 September 2026, Cook & Connect will bring together people from the neighbourhood and residents of the local refugee centre for a free event filled with food, music and creativity.'),
      p('We will share dishes from different cultures, make music together and enjoy creative activities, a children’s corner, a storytelling corner and a free clothing market. You are welcome to simply come and enjoy the event, but you can also volunteer, donate clothes or join the jam session.'),
      h2('Event details'),
      bulleted(strong('Date: '), 'Saturday, 12 September 2026'),
      bulleted(strong('Time: '), '4:00 PM – 10:00 PM'),
      bulleted(strong('Location: '), 'Shebang, Lemelerbergweg 35G, Amsterdam-Zuidoost'),
      bulleted(strong('Admission: '), 'Free'),
      p(em('Places are limited. Scan the QR code on the poster below or open the '), link('registration form', 'https://docs.google.com/forms/d/e/1FAIpQLSf5xI2W1GhNae35iv_EUOyRwuQCzWdL4894NbCiPQNqkMig-A/viewform'), '.'),
      p('We look forward to meeting you!'),
    ],
  },
  {
    _id: 'page-join-the-team',
    _type: 'page',
    title: 'Join the Cook & Connect team',
    slug: { _type: 'slug', current: 'join-the-team' },
    description: 'Volunteer with Cook & Connect and help bring people together through food and community.',
    body: [
      p('Cook & Connect is a community initiative in Amsterdam that brings locals and refugees together through shared dinners at people’s homes. Many refugees living in COA centers are not allowed to cook for themselves — something they deeply miss. Through cooking and eating together, we create moments of connection, cultural exchange, understanding, and belonging.'),
      p('What started as small dinner evenings is slowly growing into a wider movement focused on bringing back humanity in a society that often feels increasingly divided and disconnected. To help Cook & Connect grow sustainably and reach more people, we are currently looking for ', em('volunteers'), ' who would like to contribute their skills, ideas, energy, and time to the project.'),
      h2('Marketing & Social Media'),
      p('Help us grow the visibility of Cook & Connect and spread the story behind the project.'),
      p(em('This could include:')),
      bulleted('Creating content for Instagram and LinkedIn'),
      bulleted('Helping with branding and storytelling'),
      bulleted('Social media strategy'),
      bulleted('Growing online visibility'),
      bulleted('Photography/video content'),
      bulleted('SEO knowledge is a huge plus!'),
      h2('Communication & Community Building'),
      p('Help us build partnerships, strengthen the community, and connect with organizations and participants.'),
      p(em('This could include:')),
      bulleted('Outreach and communication'),
      bulleted('Writing emails and newsletters'),
      bulleted('Building partnerships with local organizations'),
      bulleted('Helping manage community communication'),
      bulleted('Storytelling and media outreach'),
      h2('Subsidies, Funding & Grants'),
      p('As Cook & Connect grows, sustainable funding will help us organize more dinners, reach more people, and create long-term impact.'),
      p('We are looking for people with experience or interest in:'),
      bulleted('Grant writing'),
      bulleted('Subsidy applications'),
      bulleted('Fundraising'),
      bulleted('Social impact funding'),
      bulleted('Researching opportunities for financial support'),
      h2('Every Form of Help is Welcome'),
      p('You do not need to commit huge amounts of time to make a difference. Even helping out occasionally for a few hours, sharing ideas, using your expertise once in a while, or supporting the project behind the scenes can already be incredibly valuable.'),
      p('Cook & Connect is growing organically, and every contribution — big or small — genuinely helps.'),
      h2('What you get in return'),
      p('While these are volunteer positions, we hope the experience itself feels meaningful and rewarding.'),
      p('By joining Cook & Connect, you become part of a warm, creative, and purpose-driven community where human connection is central.'),
      p('You will have the opportunity to:'),
      bulleted('Make a real social impact'),
      bulleted('Meet people from different cultures and backgrounds'),
      bulleted('Contribute to a more connected and compassionate society'),
      bulleted('Be part of a growing grassroots initiative'),
      bulleted('Help shape the future of the project together'),
      p('Whether you can help occasionally or would like to be more actively involved — we would love to hear from you.'),
      p('Let’s bring back humanity, learn from each other and exchange cultures.'),
    ],
  },
];

const existingPages = await client.fetch(
  '*[_id in $ids]{_id, "posterId": poster.asset._ref}',
  { ids: pages.map((page) => page._id) },
);
const existingIds = new Set(existingPages.map((page) => page._id));
const eventPage = existingPages.find((page) => page._id === 'page-event');
const eventDocument = pages.find((page) => page._id === 'page-event');

if (!eventDocument) {
  throw new Error('The seed data is missing the event page.');
}

if (!existingIds.has('page-event') || !eventPage?.posterId) {
  const posterPath = fileURLToPath(new URL('../public/assets/event-poster.jpg', import.meta.url));
  await access(posterPath);
  const poster = await client.assets.upload('image', createReadStream(posterPath), {
    filename: 'event-poster.jpg',
  });
  eventDocument.poster = {
    _type: 'image',
    asset: { _type: 'reference', _ref: poster._id },
    alt: 'Cook & Connect Community Event poster with a QR code to register',
  };
  if (existingIds.has('page-event')) {
    await client
      .patch('page-event')
      .set({ poster: eventDocument.poster })
      .commit();
  }
}

for (const page of pages) {
  if (existingIds.has(page._id)) {
    console.log(`Keeping existing Sanity page: ${page.slug.current}`);
    continue;
  }

  await client.createIfNotExists(page);
  console.log(`Created Sanity page: ${page.slug.current}`);
}

console.log(`Finished initializing ${pages.length} Cook & Connect pages.`);
