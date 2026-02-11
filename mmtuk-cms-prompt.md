# MMTUK Conversational CMS — Claude Code Build Prompt

## Project Overview

Build a Django web application that serves as a conversational CMS for the MMTUK website (mmtuk.org). Team members interact with a chat interface powered by the Anthropic API (Claude) to add, edit, and manage content on the site. The chatbot asks clarifying questions, validates input against the content schema, shows a preview for confirmation, and then commits the resulting markdown files to the site's GitHub repo, triggering an automatic rebuild and deployment on Railway.

The MMTUK site is a static Astro 5.x site. All content lives as markdown files with YAML frontmatter in `src/content/`. Deploying new content means creating or editing the correct markdown file, committing to the `optimize-deploy` branch, and pushing to GitHub. Railway auto-deploys from that branch.

**Site repo:** https://github.com/ChrisB2025/MMTUK
**Branch:** `optimize-deploy`
**This app** will be deployed as a separate Railway service.

---

## Tech Stack

- **Python 3.12+**
- **Django 5.x** with built-in auth system
- **Anthropic Python SDK** for Claude API integration (claude-sonnet-4-20250514 model)
- **GitPython** for git operations (clone, commit, push)
- **httpx** or **requests** for fetching URLs (Substack scraping, image downloads)
- **Pillow** for image conversion (HEIC/WebP to PNG)
- **BeautifulSoup4** for HTML parsing when extracting content from URLs
- **Gunicorn** for production serving
- **SQLite** for the database (sufficient for this team size)
- **Whitenoise** for static file serving in production
- Simple HTML/CSS/JS chat interface (no React, no frontend framework, keep it minimal)

---

## Django Project Structure

```
mmtuk-cms/
├── manage.py
├── requirements.txt
├── Dockerfile
├── railway.toml
├── .env.example
├── mmtuk_cms/
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
├── chat/
│   ├── models.py          # Conversation, Message, ContentDraft models
│   ├── views.py           # Chat API endpoints
│   ├── urls.py
│   ├── admin.py
│   ├── consumers.py       # (optional) WebSocket consumer if using channels
│   ├── services/
│   │   ├── anthropic_service.py   # Claude API integration
│   │   ├── git_service.py         # Git clone/commit/push operations
│   │   ├── content_service.py     # Markdown file generation
│   │   ├── scraper_service.py     # URL scraping (Substack, general)
│   │   └── image_service.py       # Image download and conversion
│   ├── templates/
│   │   ├── chat/
│   │   │   ├── index.html         # Main chat interface
│   │   │   ├── login.html         # Login page
│   │   │   └── pending.html       # Pending approvals dashboard
│   │   └── base.html
│   └── static/
│       └── chat/
│           ├── style.css
│           └── chat.js
├── accounts/
│   ├── models.py          # Extended user profile with roles
│   ├── views.py
│   ├── admin.py
│   └── urls.py
└── content_schema/
    └── schemas.py         # Content type definitions and validation
```

---

## User Roles and Permissions

### Role Definitions

Create a `UserProfile` model extending Django's User with a `role` field:

```python
ROLE_CHOICES = [
    ('admin', 'Admin'),              # Full access, can publish directly, manage users
    ('editor', 'Editor'),            # Can create and publish articles, briefings, news
    ('group_lead', 'Group Lead'),    # Can create/publish local events and local news for their group only
    ('contributor', 'Contributor'),  # Can create drafts, requires approval to publish
]
```

The `UserProfile` should also have an optional `local_group` field (CharField matching localGroups slugs) for group leads.

### Permission Matrix

| Action | Admin | Editor | Group Lead | Contributor |
|--------|-------|--------|------------|-------------|
| Add articles | Direct publish | Direct publish | No | Draft only |
| Add briefings | Direct publish | Direct publish | No | Draft only |
| Add news | Direct publish | Direct publish | No | Draft only |
| Add local events | Direct publish | Direct publish | Own group only, direct publish | Draft only |
| Add local news | Direct publish | Direct publish | Own group only, direct publish | Draft only |
| Add/edit bios | Direct publish | No | No | No |
| Add ecosystem entries | Direct publish | Direct publish | No | No |
| Approve pending drafts | Yes | Yes | Own group content only | No |
| Manage users | Yes | No | No | No |

### Approval Workflow

When a user with `contributor` role (or a `group_lead` acting outside their group) creates content:

1. The content is saved as a `ContentDraft` in the Django database with status `pending`
2. The user sees confirmation that their draft is awaiting approval
3. Users with appropriate approval permissions see pending drafts on the `/pending/` dashboard
4. An approver can review the generated markdown preview, then approve (triggers git commit/push) or reject (with optional feedback message)
5. The original contributor is notified of the decision next time they use the chat

When a user with direct publish permission creates content:
1. After confirmation in the chat, content is committed and pushed immediately
2. No approval step needed

---

## Content Schema Definitions

Create a Python module (`content_schema/schemas.py`) that defines all content types. This will be used both for validation and for constructing the system prompt sent to Claude.

```python
CONTENT_TYPES = {
    "article": {
        "name": "Article",
        "directory": "src/content/articles/",
        "filename_pattern": "{slug}.md",
        "required_fields": ["title", "slug", "category", "author", "pubDate"],
        "fields": {
            "title": {"type": "string", "description": "Article title"},
            "slug": {"type": "string", "description": "URL path segment, lowercase with hyphens"},
            "category": {
                "type": "enum",
                "options": ["Article", "Commentary", "Research", "Core Ideas", "Core Insights", "But what about...?"],
                "description": "Determines layout and page grouping. Core Ideas/Core Insights use simplified layout. 'But what about...?' uses rebuttal layout."
            },
            "layout": {
                "type": "enum",
                "options": ["default", "simplified", "rebuttal"],
                "default": "default",
                "description": "Page layout template. Auto-set based on category if not specified."
            },
            "sector": {"type": "string", "default": "Economics"},
            "author": {"type": "string", "default": "MMTUK"},
            "authorTitle": {"type": "string", "optional": True},
            "pubDate": {"type": "date", "description": "Publication date in YYYY-MM-DD format"},
            "readTime": {"type": "number", "default": 5, "description": "Estimated read time in minutes"},
            "summary": {"type": "string", "description": "Used in cards and meta descriptions"},
            "thumbnail": {"type": "string", "description": "Path in public/images/, e.g. /images/my-article.png"},
            "mainImage": {"type": "string", "description": "Larger hero image path"},
            "featured": {"type": "boolean", "default": False, "description": "Featured items appear first/larger on listing pages"},
            "color": {"type": "string", "optional": True, "description": "Card accent color"}
        },
        "appears_on": ["/articles", "/education", "/research", "/index"],
        "route": "/articles/{slug}"
    },

    "briefing": {
        "name": "Briefing",
        "directory": "src/content/briefings/",
        "filename_pattern": "{slug}.md",
        "required_fields": ["title", "slug", "author", "pubDate"],
        "fields": {
            "title": {"type": "string"},
            "slug": {"type": "string"},
            "author": {"type": "string"},
            "authorTitle": {"type": "string", "optional": True},
            "pubDate": {"type": "date"},
            "readTime": {"type": "number", "default": 5},
            "summary": {"type": "string"},
            "thumbnail": {"type": "string", "description": "Card image path in public/images/"},
            "mainImage": {"type": "string", "optional": True},
            "featured": {"type": "boolean", "default": False},
            "draft": {"type": "boolean", "default": False, "description": "Draft briefings are filtered out of all pages"},
            "sourceUrl": {"type": "string", "description": "Original article URL (for Substack imports)"},
            "sourceTitle": {"type": "string", "optional": True},
            "sourceAuthor": {"type": "string", "optional": True},
            "sourcePublication": {"type": "string", "optional": True},
            "sourceDate": {"type": "date", "optional": True}
        },
        "appears_on": ["/research/briefings", "/research", "/index"],
        "route": "/research/briefings/{slug}",
        "notes": "Briefings can be imported from Substack URLs. When a URL is provided, scrape the article content, download and convert the thumbnail to PNG, and populate source fields automatically."
    },

    "news": {
        "name": "News",
        "directory": "src/content/news/",
        "filename_pattern": "{slug}.md",
        "required_fields": ["title", "slug", "date", "category"],
        "fields": {
            "title": {"type": "string"},
            "slug": {"type": "string"},
            "date": {"type": "date"},
            "category": {
                "type": "enum",
                "options": ["Announcement", "Event", "Press Release", "Update"]
            },
            "summary": {"type": "string"},
            "thumbnail": {"type": "string", "optional": True},
            "mainImage": {"type": "string", "optional": True}
        },
        "appears_on": ["/about-us"],
        "route": "/news/{slug}",
        "notes": "News items appear as accordion items on /about-us. There is no /news index page."
    },

    "local_event": {
        "name": "Local Event",
        "directory": "src/content/localEvents/",
        "filename_pattern": "{slug}.md",
        "required_fields": ["title", "slug", "localGroup", "date", "tag", "location", "description"],
        "fields": {
            "title": {"type": "string"},
            "slug": {"type": "string"},
            "localGroup": {
                "type": "enum",
                "options": ["brighton", "london", "oxford", "pennines", "scotland", "solent"],
                "description": "Must match an existing local group slug"
            },
            "date": {"type": "datetime", "description": "Event date and time in ISO format"},
            "tag": {"type": "string", "description": "Category label, e.g. Lecture, Meetup, Festival, Workshop"},
            "location": {"type": "string", "description": "Venue name and address"},
            "description": {"type": "string", "description": "Short description for card display"},
            "link": {"type": "string", "optional": True, "description": "URL, internal (/news/...) or external (https://...)"},
            "image": {"type": "string", "optional": True, "description": "Event card image path"}
        },
        "appears_on": ["/community", "/local-group/{localGroup}", "/about-us (special cases only)"],
        "route": "No individual pages",
        "notes": "Events appear on /community (with some exclusions by slug), on relevant /local-group/ pages filtered by localGroup, and sometimes on /about-us for featured national events."
    },

    "local_news": {
        "name": "Local News",
        "directory": "src/content/localNews/",
        "filename_pattern": "{slug}.md",
        "required_fields": ["heading", "slug", "text", "localGroup", "date"],
        "fields": {
            "heading": {"type": "string", "description": "Note: this field is called 'heading' not 'title'"},
            "slug": {"type": "string"},
            "text": {"type": "string", "description": "Summary text for card display"},
            "localGroup": {
                "type": "enum",
                "options": ["brighton", "london", "oxford", "pennines", "scotland", "solent"],
                "description": "Must match an existing local group slug"
            },
            "date": {"type": "date"},
            "link": {"type": "string", "optional": True},
            "image": {"type": "string", "optional": True}
        },
        "appears_on": ["/local-group/{localGroup}"],
        "route": "/local-group/{localGroup}/{slug}"
    },

    "bio": {
        "name": "Bio",
        "directory": "src/content/bios/",
        "filename_pattern": "{slug}.md",
        "required_fields": ["name", "slug", "role"],
        "fields": {
            "name": {"type": "string", "description": "Full name with title, e.g. Dr Phil Armstrong"},
            "slug": {"type": "string"},
            "role": {"type": "string", "description": "Role title. Use 'Advisory Board Member' for advisory board. Other roles go to Steering Committee."},
            "photo": {"type": "string", "description": "Path like /images/bios/Name.avif"},
            "linkedin": {"type": "string", "optional": True},
            "twitter": {"type": "string", "optional": True},
            "website": {"type": "string", "optional": True},
            "advisoryBoard": {"type": "boolean", "default": False}
        },
        "appears_on": ["/about-us", "/founders"],
        "route": "No individual pages",
        "notes": "Admin only. On /about-us, bios split into Steering Committee (role != 'Advisory Board Member') and Advisory Board."
    },

    "ecosystem": {
        "name": "Ecosystem Entry",
        "directory": "src/content/ecosystem/",
        "filename_pattern": "{slug}.md",
        "required_fields": ["name", "slug"],
        "fields": {
            "name": {"type": "string"},
            "slug": {"type": "string"},
            "country": {"type": "string", "default": "UK"},
            "types": {"type": "string_array", "description": "Taxonomy tags, e.g. ['all', 'offline-events']"},
            "summary": {"type": "string"},
            "logo": {"type": "string", "optional": True},
            "website": {"type": "string", "optional": True},
            "twitter": {"type": "string", "optional": True},
            "facebook": {"type": "string", "optional": True},
            "youtube": {"type": "string", "optional": True},
            "discord": {"type": "string", "optional": True},
            "status": {
                "type": "enum",
                "options": ["Active", "Inactive", "Archived"],
                "default": "Active"
            }
        },
        "appears_on": ["/ecosystem"],
        "route": "/ecosystem/{slug}"
    }
}
```

---

## Anthropic API System Prompt

The system prompt sent to Claude with every conversation should be dynamically constructed from the content schemas above, plus the following context:

```
You are the MMTUK Content Assistant, a helpful chatbot that helps team members add and manage content on the MMTUK website (mmtuk.org).

You help users create the following content types: Articles, Briefings, News, Local Events, Local News, Bios, and Ecosystem entries.

## How you work

1. Ask the user what they want to do (add an article, create an event, etc.)
2. Collect the required information through natural conversation. Ask one or two questions at a time, not all fields at once.
3. For briefings from URLs: when given a Substack or article URL, the system will automatically extract the content. You will receive the extracted data and should confirm it with the user.
4. For all content: generate a slug automatically from the title (lowercase, hyphens, no special characters). Suggest it to the user and let them change it.
5. Set sensible defaults: author defaults to "MMTUK", readTime defaults to 5, pubDate defaults to today unless specified.
6. Once you have all required fields, present a complete summary in a clear format and ask for confirmation.
7. When the user confirms, respond with a JSON block in this exact format:

```json
{
  "action": "create",
  "content_type": "<type>",
  "frontmatter": { ... },
  "body": "markdown content here",
  "images": [
    {"url": "source_url", "save_as": "path/in/public/images/filename.png"}
  ]
}
```

## Current user context
The user's role is: {role}
The user's local group (if group lead): {local_group}

## Important rules
- Always write MMTUK without a space, never "MMT UK"
- Slugs should use the pattern: lowercase-words-with-hyphens
- For articles, auto-set the layout based on category: "Core Ideas" and "Core Insights" get "simplified", "But what about...?" gets "rebuttal", others get "default"
- For briefings imported from URLs, always populate the source fields (sourceUrl, sourceTitle, sourceAuthor, sourcePublication, sourceDate)
- For local events and local news, the localGroup must be one of: brighton, london, oxford, pennines, scotland, solent
- Date format in frontmatter should be YYYY-MM-DD for dates and YYYY-MM-DDTHH:MM for datetimes
- Image paths in frontmatter should be relative to public/, e.g. /images/my-image.png
- Never invent or hallucinate content. If you need information, ask the user.
- If the user pastes a URL, ask the system to scrape it before proceeding.
- If the user wants to do something outside your capabilities, let them know and suggest they contact an admin.

## Content schema details
{dynamically_inserted_schema_details}
```

The `{dynamically_inserted_schema_details}` section should be generated from the CONTENT_TYPES dictionary, formatted as readable documentation for each content type including all fields, types, defaults, and notes.

---

## Chat Interface

### Frontend (templates/chat/index.html)

Build a clean, minimal chat interface:

- Full-height chat window with scrolling message area
- Messages styled differently for user (right-aligned, blue) and assistant (left-aligned, grey)
- Text input at the bottom with send button
- Support for pasting URLs (detect and highlight)
- Markdown rendering in assistant messages (use a lightweight library like marked.js)
- Show a typing indicator while waiting for Claude's response
- Session-based: each page load starts a new conversation, but conversation history is stored in the database
- Show the user's role and name in a header bar
- Logout button in the header
- Link to /pending/ dashboard if user has approval permissions
- MMTUK branding (use the site's navy/teal colour scheme: primary navy #1a1a2e, accent teal #00b4d8)

### Chat API Endpoint

`POST /api/chat/` — accepts JSON:
```json
{
  "message": "user's message text",
  "conversation_id": "uuid or null for new conversation"
}
```

Returns JSON:
```json
{
  "response": "assistant's message text",
  "conversation_id": "uuid",
  "action_taken": null | {"type": "content_created", "details": {...}} | {"type": "draft_pending", "details": {...}}
}
```

### Message Flow

1. User sends message
2. Backend retrieves conversation history from database
3. Backend constructs messages array for Anthropic API (system prompt + conversation history + new message)
4. If the user's message contains a URL and the conversation context suggests they want to import content, call the scraper service first and include the extracted data in the message to Claude
5. Send to Anthropic API, receive response
6. Parse the response: if it contains a JSON action block, extract it and process the content creation
7. If content creation is triggered:
   a. Validate the frontmatter against the content schema
   b. Check user permissions for the content type
   c. If user has direct publish permission: create files, commit, push, notify user
   d. If user needs approval: save as ContentDraft, notify user it's pending
8. Save all messages to database
9. Return response to frontend

---

## Database Models

### Conversation
- `id`: UUIDField (primary key)
- `user`: ForeignKey to User
- `created_at`: DateTimeField
- `updated_at`: DateTimeField

### Message
- `id`: UUIDField (primary key)
- `conversation`: ForeignKey to Conversation
- `role`: CharField (choices: 'user', 'assistant', 'system')
- `content`: TextField
- `created_at`: DateTimeField

### ContentDraft
- `id`: UUIDField (primary key)
- `conversation`: ForeignKey to Conversation
- `created_by`: ForeignKey to User
- `content_type`: CharField (article, briefing, news, local_event, local_news, bio, ecosystem)
- `title`: CharField (for display in pending dashboard)
- `frontmatter`: JSONField
- `body`: TextField (markdown content)
- `images`: JSONField (list of image URLs and target paths)
- `status`: CharField (choices: 'pending', 'approved', 'rejected')
- `reviewed_by`: ForeignKey to User (nullable)
- `review_note`: TextField (nullable, for rejection feedback)
- `created_at`: DateTimeField
- `reviewed_at`: DateTimeField (nullable)

### UserProfile
- `user`: OneToOneField to User
- `role`: CharField (choices: admin, editor, group_lead, contributor)
- `local_group`: CharField (nullable, for group_lead users, must match a localGroups slug)

---

## Git Service

### Setup
- On app startup (or first use), clone the MMTUK repo to a local directory (e.g. `/tmp/mmtuk-repo/`)
- Use a GitHub Personal Access Token stored in environment variable `GITHUB_TOKEN`
- Remote URL format: `https://{GITHUB_TOKEN}@github.com/ChrisB2025/MMTUK.git`
- Always work on the `optimize-deploy` branch

### Operations

**`ensure_repo_current()`**: Pull latest changes before any write operation. If the local clone doesn't exist, clone fresh.

**`create_content_file(filepath, content)`**: Write the markdown file to the correct location in the cloned repo.

**`save_image(source_url, target_path)`**: Download image from URL, convert to PNG using Pillow if necessary, save to the correct location in the cloned repo under `public/images/`.

**`commit_and_push(message, author_name, author_email)`**: Stage all changes, commit with a descriptive message (e.g. "Add briefing: UK Fiscal Policy Analysis — via MMTUK CMS (ChrisB)"), push to origin/optimize-deploy.

**Error handling**: If push fails (e.g. conflict), pull with rebase and retry once. If it still fails, save the draft and notify the user that manual intervention is needed.

---

## Scraper Service

### Substack URL Detection
Detect Substack URLs by pattern: `*.substack.com/*` or custom domains that redirect to Substack.

### Substack Scraping
When given a Substack URL:
1. Fetch the page HTML
2. Extract using meta tags and page structure:
   - Title (from `<meta property="og:title">` or `<h1>`)
   - Author (from `<meta name="author">` or byline)
   - Publication date (from `<meta property="article:published_time">` or `<time>`)
   - Publication name (from `<meta property="og:site_name">`)
   - Thumbnail/hero image URL (from `<meta property="og:image">`)
   - Article body content (from the article/post body container)
3. Convert article HTML body to markdown (use `markdownify` or similar)
4. Clean up the markdown: remove Substack subscription CTAs, share buttons, and other non-content elements
5. Return structured data for the chatbot to present to the user

### Image Handling
When downloading images:
1. Fetch the image from the source URL
2. If from Substack CDN (substackcdn.com), append `?f_png` to get PNG format if the URL doesn't already specify a format
3. Convert to PNG using Pillow if the image is HEIC, WebP, or any other non-PNG format
4. Save with a clean filename derived from the content slug (e.g., `{slug}-thumbnail.png`)
5. Images go in the cloned repo at `public/images/`

### General URL Scraping
For non-Substack URLs:
1. Fetch the page
2. Extract title, author, date, and main content using BeautifulSoup
3. Attempt to find the article body using common selectors (`<article>`, `<main>`, `.post-content`, etc.)
4. Convert to markdown
5. Return for user confirmation

---

## Pending Approvals Dashboard

### Route: `/pending/`

Accessible to users with admin, editor, or group_lead roles.

### Display
- List of ContentDraft objects with status='pending'
- Group leads only see drafts for their local group
- Each draft shows: content type, title, created by, created at
- Click to expand shows: full markdown preview (rendered), frontmatter fields
- Two action buttons: Approve (green) and Reject (red)
- Reject opens a text input for optional feedback

### Approve Action
1. Take the ContentDraft data
2. Call git service to create the file, download any images, commit and push
3. Update draft status to 'approved', set reviewed_by and reviewed_at
4. Show success confirmation

### Reject Action
1. Update draft status to 'rejected', save review note
2. Show confirmation

---

## Environment Variables

```
DJANGO_SECRET_KEY=<generate a secure key>
ANTHROPIC_API_KEY=<Anthropic API key>
GITHUB_TOKEN=<GitHub Personal Access Token with repo write access>
GITHUB_REPO=ChrisB2025/MMTUK
GITHUB_BRANCH=optimize-deploy
DEBUG=False
ALLOWED_HOSTS=<railway domain>,localhost
DATABASE_URL=sqlite:///db.sqlite3
```

---

## Dockerfile

```dockerfile
FROM python:3.12-slim

RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN python manage.py collectstatic --noinput

EXPOSE 8000

CMD ["sh", "-c", "python manage.py migrate && gunicorn mmtuk_cms.wsgi:application --bind 0.0.0.0:${PORT:-8000} --workers 2 --timeout 120"]
```

The timeout is set to 120 seconds because Claude API calls can take time, especially for longer content generation.

---

## railway.toml

```toml
[build]
builder = "dockerfile"

[deploy]
healthcheckPath = "/health/"
restartPolicyType = "on_failure"
restartPolicyMaxRetries = 3
```

---

## Additional Endpoints

### `/health/` — Health check
Return 200 OK. Used by Railway for deployment health checks.

### `/admin/` — Django admin
Standard Django admin for user management and viewing/editing all models. Register all models.

### `/login/` and `/logout/` — Authentication
Standard Django auth views with custom templates matching the MMTUK brand.

---

## Management Commands

### `python manage.py createsuperuser`
Standard Django. First user should be created with this, then use Django admin to set up the UserProfile with admin role.

### `python manage.py setup_roles`
Custom command that:
1. Checks if UserProfile exists for all users, creates with 'contributor' role if missing
2. Useful after initial setup

---

## Security Considerations

- All chat endpoints require `@login_required`
- CSRF protection on all forms
- Rate limit the chat API to prevent API cost abuse (e.g., max 50 messages per user per hour using Django cache framework)
- The GitHub token should have minimal permissions (just repo content write access)
- Set `SECURE_SSL_REDIRECT = True` in production
- Set `SESSION_COOKIE_SECURE = True` in production
- Input sanitisation on all user inputs before passing to Claude

---

## Testing the Build

After building, verify:

1. `python manage.py runserver` starts without errors
2. Can create a superuser and log in
3. Chat interface loads and accepts messages
4. Claude responds appropriately and follows the content schema
5. Pasting a Substack URL triggers content extraction
6. Confirming content creation generates correct markdown with valid frontmatter
7. Git commit and push works (test with a test branch first)
8. Approval workflow works: contributor creates draft, editor approves, content is published
9. Docker build succeeds and the container runs correctly

---

## Key Implementation Notes

1. **Markdown generation**: When generating the markdown file from the JSON action, the frontmatter should use YAML format with `---` delimiters. Dates should not be quoted in YAML. Boolean values should be lowercase (`true`/`false`).

2. **Slug generation**: Auto-generate from title using `re.sub(r'[^a-z0-9]+', '-', title.lower()).strip('-')`. Prefix with `mmtuk-` only if the content type convention requires it (check existing files for patterns).

3. **Conversation context window**: Keep the last 20 messages in the conversation when sending to Claude to manage token usage. Always include the system prompt.

4. **Streaming**: Do NOT implement streaming for the initial build. Use simple request/response. Streaming can be added later if response times feel slow.

5. **Git locking**: Use a threading lock around git operations to prevent concurrent pushes from different users. Only one git operation should run at a time.

6. **Local development**: In DEBUG mode, skip the actual git push and instead save the generated markdown files to a local `output/` directory for inspection.

7. **Error recovery**: If any step fails after content is confirmed (image download, git push, etc.), save the content as a ContentDraft with status 'pending' so nothing is lost. Notify the user of the failure and that their content has been saved for manual processing.
