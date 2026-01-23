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
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
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
        ui: {
          filename: {
            readonly: false,
            slugify: (values) => {
              return values?.slug?.toLowerCase().replace(/ /g, "-") || "";
            },
          },
        },
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
            options: ["Article", "Commentary", "Research"],
          },
          {
            type: "string",
            name: "sector",
            label: "Sector",
            required: false,
            ui: {
              defaultValue: "Economics",
            },
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
            required: false,
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
            required: false,
            ui: {
              defaultValue: 5,
            },
          },
          {
            type: "string",
            name: "summary",
            label: "Summary",
            required: false,
            ui: {
              component: "textarea",
            },
          },
          {
            type: "image",
            name: "thumbnail",
            label: "Thumbnail Image",
            required: false,
          },
          {
            type: "image",
            name: "mainImage",
            label: "Main Image",
            required: false,
          },
          {
            type: "boolean",
            name: "featured",
            label: "Featured",
            required: false,
            ui: {
              defaultValue: false,
            },
          },
          {
            type: "string",
            name: "color",
            label: "Color (hex)",
            required: false,
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
      },
      {
        name: "news",
        label: "News",
        path: "src/content/news",
        format: "md",
        ui: {
          filename: {
            readonly: false,
            slugify: (values) => {
              return values?.slug?.toLowerCase().replace(/ /g, "-") || "";
            },
          },
        },
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
            required: false,
            ui: {
              component: "textarea",
            },
          },
          {
            type: "image",
            name: "thumbnail",
            label: "Thumbnail Image",
            required: false,
          },
          {
            type: "image",
            name: "mainImage",
            label: "Main Image",
            required: false,
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
        ui: {
          filename: {
            readonly: false,
            slugify: (values) => {
              return values?.slug?.toLowerCase().replace(/ /g, "-") || "";
            },
          },
        },
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
            required: false,
          },
          {
            type: "string",
            name: "linkedin",
            label: "LinkedIn URL",
            required: false,
          },
          {
            type: "boolean",
            name: "advisoryBoard",
            label: "Advisory Board Member",
            required: false,
            ui: {
              defaultValue: false,
            },
          },
          {
            type: "rich-text",
            name: "body",
            label: "Bio",
            isBody: true,
          },
        ],
      },
      {
        name: "ecosystem",
        label: "MMT Ecosystem",
        path: "src/content/ecosystem",
        format: "md",
        ui: {
          filename: {
            readonly: false,
            slugify: (values) => {
              return values?.slug?.toLowerCase().replace(/ /g, "-") || "";
            },
          },
        },
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
            required: false,
            ui: {
              defaultValue: "UK",
            },
          },
          {
            type: "string",
            name: "types",
            label: "Types",
            required: false,
            list: true,
            description: "Categories this resource belongs to (e.g., podcast, blog, organization)",
          },
          {
            type: "string",
            name: "summary",
            label: "Summary",
            required: false,
            ui: {
              component: "textarea",
            },
          },
          {
            type: "image",
            name: "logo",
            label: "Logo",
            required: false,
          },
          {
            type: "string",
            name: "website",
            label: "Website URL",
            required: false,
          },
          {
            type: "string",
            name: "twitter",
            label: "Twitter URL",
            required: false,
          },
          {
            type: "string",
            name: "facebook",
            label: "Facebook URL",
            required: false,
          },
          {
            type: "string",
            name: "youtube",
            label: "YouTube URL",
            required: false,
          },
          {
            type: "string",
            name: "discord",
            label: "Discord URL",
            required: false,
          },
          {
            type: "string",
            name: "status",
            label: "Status",
            required: false,
            options: ["Active", "Inactive", "Archived"],
            ui: {
              defaultValue: "Active",
            },
          },
          {
            type: "rich-text",
            name: "body",
            label: "Description",
            isBody: true,
          },
        ],
      },
    ],
  },
});
