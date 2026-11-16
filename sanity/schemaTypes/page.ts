import { defineArrayMember, defineField, defineType } from 'sanity';

export default defineType({
  name: 'page',
  title: 'Website page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'menuLabel',
      title: 'Menu label',
      description: 'Optional label for this page in the site navigation.',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Search description',
      type: 'text',
      rows: 2,
      validation: (rule) => rule.required().max(180),
    }),
    defineField({
      name: 'tagline',
      title: 'Homepage tagline (home page only)',
      type: 'string',
    }),
    defineField({
      name: 'body',
      title: 'Page content',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Heading 2', value: 'h2' },
            { title: 'Heading 3', value: 'h3' },
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
            ],
            annotations: [
              defineArrayMember({
                name: 'link',
                title: 'Link',
                type: 'object',
                fields: [
                  defineField({
                    name: 'href',
                    title: 'URL',
                    type: 'url',
                    validation: (rule) =>
                      rule.required().uri({ scheme: ['http', 'https', 'mailto', 'tel'] }),
                  }),
                ],
              }),
            ],
          },
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'poster',
      title: 'Event poster (event page only)',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'slug.current' },
  },
});
