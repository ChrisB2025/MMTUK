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
            ui: {
              component: "color",
            },
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
        ],
        ui: {
          filename: {
            readonly: false,
            slugify: (values) => {
              return values?.slug?.toLowerCase().replace(/ /g, "-") || "";
            },
          },
        },
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
        ui: {
          filename: {
            readonly: false,
            slugify: (values) => {
              return values?.slug?.toLowerCase().replace(/ /g, "-") || "";
            },
          },
        },
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
        ui: {
          filename: {
            readonly: false,
            slugify: (values) => {
              return values?.slug?.toLowerCase().replace(/ /g, "-") || "";
            },
          },
        },
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
        ui: {
          filename: {
            readonly: false,
            slugify: (values) => {
              return values?.slug?.toLowerCase().replace(/ /g, "-") || "";
            },
          },
        },
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
        ],
        ui: {
          filename: {
            readonly: false,
            slugify: (values) => {
              const group = values?.localGroup || "";
              const slug = values?.slug?.toLowerCase().replace(/ /g, "-") || "";
              return `${group}-${slug}`;
            },
          },
        },
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
        ui: {
          filename: {
            readonly: false,
            slugify: (values) => {
              return values?.slug?.toLowerCase().replace(/ /g, "-") || "";
            },
          },
        },
      },
    ],
  },
});
