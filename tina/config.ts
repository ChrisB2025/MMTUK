import { defineConfig } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

export default defineConfig({
  branch,

  // Get this from tina.io
  clientId: process.env.TINA_CLIENT_ID,
  // Get this from tina.io
  token: process.env.TINA_TOKEN,

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "images",
      publicFolder: "public",
    },
  },
  // See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/schema/
  schema: {
    collections: [
      {
        name: "articles",
        label: "Articles",
        path: "src/content/articles",
        format: "md",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "slug",
            label: "Slug",
            required: true,
          },
          {
            type: "string",
            name: "category",
            label: "Category",
            required: true,
            options: ["Article", "Commentary", "Research", "Core Ideas"],
          },
          {
            type: "string",
            name: "layout",
            label: "Layout",
            options: ["default", "simplified"],
          },
          {
            type: "string",
            name: "sector",
            label: "Sector",
          },
          {
            type: "string",
            name: "author",
            label: "Author",
            required: true,
          },
          {
            type: "string",
            name: "authorTitle",
            label: "Author Title",
          },
          {
            type: "datetime",
            name: "pubDate",
            label: "Publication Date",
            required: true,
          },
          {
            type: "number",
            name: "readTime",
            label: "Read Time (minutes)",
          },
          {
            type: "string",
            name: "summary",
            label: "Executive Summary",
            ui: {
              component: "textarea",
            },
          },
          {
            type: "image",
            name: "thumbnail",
            label: "Thumbnail",
          },
          {
            type: "image",
            name: "mainImage",
            label: "Main Image",
          },
          {
            type: "boolean",
            name: "featured",
            label: "Featured",
          },
          {
            type: "string",
            name: "color",
            label: "Accent Color",
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
        ],
      },
      {
        name: "news",
        label: "News",
        path: "src/content/news",
        format: "md",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "slug",
            label: "Slug",
            required: true,
          },
          {
            type: "datetime",
            name: "date",
            label: "Date",
            required: true,
          },
          {
            type: "string",
            name: "category",
            label: "Category",
            required: true,
            options: ["Announcement", "Event", "Press Release", "Update"],
          },
          {
            type: "string",
            name: "summary",
            label: "Summary",
            ui: {
              component: "textarea",
            },
          },
          {
            type: "image",
            name: "thumbnail",
            label: "Thumbnail",
          },
          {
            type: "image",
            name: "mainImage",
            label: "Main Image",
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
        ],
      },
      {
        name: "bios",
        label: "Team Bios",
        path: "src/content/bios",
        format: "md",
        fields: [
          {
            type: "string",
            name: "name",
            label: "Name",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "slug",
            label: "Slug",
            required: true,
          },
          {
            type: "string",
            name: "role",
            label: "Role",
            required: true,
          },
          {
            type: "image",
            name: "photo",
            label: "Photo",
          },
          {
            type: "string",
            name: "linkedin",
            label: "LinkedIn URL",
          },
          {
            type: "boolean",
            name: "advisoryBoard",
            label: "Advisory Board Member",
          },
          {
            type: "rich-text",
            name: "body",
            label: "Description",
            isBody: true,
          },
        ],
      },
      {
        name: "ecosystem",
        label: "Ecosystem Profiles",
        path: "src/content/ecosystem",
        format: "md",
        fields: [
          {
            type: "string",
            name: "name",
            label: "Name",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "slug",
            label: "Slug",
            required: true,
          },
          {
            type: "string",
            name: "country",
            label: "Country",
          },
          {
            type: "string",
            name: "types",
            label: "Types",
            list: true,
          },
          {
            type: "string",
            name: "summary",
            label: "Summary",
            ui: {
              component: "textarea",
            },
          },
          {
            type: "image",
            name: "logo",
            label: "Logo",
          },
          {
            type: "string",
            name: "website",
            label: "Website",
          },
          {
            type: "string",
            name: "twitter",
            label: "Twitter/X",
          },
          {
            type: "string",
            name: "facebook",
            label: "Facebook",
          },
          {
            type: "string",
            name: "youtube",
            label: "YouTube",
          },
          {
            type: "string",
            name: "discord",
            label: "Discord",
          },
          {
            type: "string",
            name: "status",
            label: "Status",
            options: ["Active", "Inactive", "Archived"],
          },
          {
            type: "rich-text",
            name: "body",
            label: "Description",
            isBody: true,
          },
        ],
      },
      {
        name: "localNews",
        label: "Local Group News",
        path: "src/content/localNews",
        format: "md",
        fields: [
          {
            type: "string",
            name: "heading",
            label: "Heading",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "slug",
            label: "Slug",
            required: true,
          },
          {
            type: "string",
            name: "localGroup",
            label: "Local Group",
            required: true,
            options: [
              "scotland",
              "london",
              "wales",
              "pennines",
              "oxford",
              "brighton",
              "solent",
            ],
          },
          {
            type: "datetime",
            name: "date",
            label: "Date",
            required: true,
          },
          {
            type: "string",
            name: "text",
            label: "Text",
            description: "Maximum 50 words",
            required: true,
            ui: {
              component: "textarea",
            },
          },
          {
            type: "string",
            name: "link",
            label: "Link",
          },
          {
            type: "image",
            name: "image",
            label: "Image",
          },
          {
            type: "rich-text",
            name: "body",
            label: "Article Content (Optional)",
            description: "Full article content. If provided, 'Read more' will link to an article page.",
            isBody: true,
          },
        ],
      },
      {
        name: "localGroups",
        label: "Local Groups",
        path: "src/content/localGroups",
        format: "md",
        fields: [
          {
            type: "string",
            name: "name",
            label: "Name",
            isTitle: true,
            required: true,
            description: "e.g. Scotland, London",
          },
          {
            type: "string",
            name: "slug",
            label: "Slug",
            required: true,
            description: "e.g. scotland, london (lowercase, no spaces)",
          },
          {
            type: "string",
            name: "title",
            label: "Title",
            required: true,
            description: "e.g. MMT UK | Scotland",
          },
          {
            type: "string",
            name: "tagline",
            label: "Tagline",
            required: true,
            description: "Short description for card display",
          },
          {
            type: "image",
            name: "headerImage",
            label: "Header Image",
            required: true,
          },
          {
            type: "string",
            name: "leaderName",
            label: "Leader Name",
          },
          {
            type: "string",
            name: "leaderIntro",
            label: "Leader Introduction",
            description: "Introduction text from the group leader",
            ui: {
              component: "textarea",
            },
          },
          {
            type: "string",
            name: "discordLink",
            label: "Discord Link",
          },
          {
            type: "boolean",
            name: "active",
            label: "Active",
          },
          {
            type: "rich-text",
            name: "body",
            label: "Description",
            isBody: true,
          },
        ],
      },
      {
        name: "localEvents",
        label: "Local Group Events",
        path: "src/content/localEvents",
        format: "md",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "slug",
            label: "Slug",
            required: true,
            description: "URL-friendly identifier (lowercase, hyphens)",
          },
          {
            type: "string",
            name: "localGroup",
            label: "Local Group",
            required: true,
            options: [
              "scotland",
              "london",
              "wales",
              "pennines",
              "oxford",
              "brighton",
              "solent",
            ],
          },
          {
            type: "datetime",
            name: "date",
            label: "Event Date",
            required: true,
          },
          {
            type: "string",
            name: "tag",
            label: "Event Type",
            required: true,
            options: ["Workshop", "Roundtable", "Lecture", "Meetup", "Discussion"],
          },
          {
            type: "string",
            name: "location",
            label: "Location",
            required: true,
          },
          {
            type: "string",
            name: "description",
            label: "Description",
            required: true,
            ui: {
              component: "textarea",
            },
          },
          {
            type: "string",
            name: "link",
            label: "Registration Link",
          },
          {
            type: "image",
            name: "image",
            label: "Event Image",
          },
        ],
      },
      {
        name: "briefings",
        label: "MMT Briefings",
        path: "src/content/briefings",
        format: "md",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "slug",
            label: "Slug",
            required: true,
          },
          {
            type: "string",
            name: "author",
            label: "Author",
            required: true,
          },
          {
            type: "string",
            name: "authorTitle",
            label: "Author Title",
          },
          {
            type: "datetime",
            name: "pubDate",
            label: "Publication Date",
            required: true,
          },
          {
            type: "number",
            name: "readTime",
            label: "Read Time (minutes)",
          },
          {
            type: "string",
            name: "summary",
            label: "Summary",
            ui: {
              component: "textarea",
            },
          },
          {
            type: "image",
            name: "thumbnail",
            label: "Thumbnail",
          },
          {
            type: "image",
            name: "mainImage",
            label: "Main Image",
          },
          {
            type: "boolean",
            name: "featured",
            label: "Featured",
          },
          {
            type: "string",
            name: "sourceUrl",
            label: "Source URL",
            description: "URL of the article being responded to",
          },
          {
            type: "string",
            name: "sourceTitle",
            label: "Source Title",
            description: "Title of the article being responded to",
          },
          {
            type: "string",
            name: "sourceAuthor",
            label: "Source Author",
            description: "Author of the original article",
          },
          {
            type: "string",
            name: "sourcePublication",
            label: "Source Publication",
            description: "Publication where the source article appeared",
          },
          {
            type: "datetime",
            name: "sourceDate",
            label: "Source Date",
            description: "Publication date of the source article",
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
        ],
      },
    ],
  },
});
