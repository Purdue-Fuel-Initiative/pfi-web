# Purdue Fuel Initiative Website

PFI's website built with [Next.js](https://nextjs.org) and [Payload CMS v3](https://payloadcms.com). Officers can edit all site content through the admin panel — no code changes needed.

## Getting Started (Local Development)

### Prerequisites

- Node.js 22+
- Docker (for Postgres)

### Setup

1. Start the database:
   ```sh
   docker compose up postgres -d
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Copy the environment file and update secrets:
   ```sh
   cp .env.example .env
   ```
   The defaults work for local dev. For production, change `PAYLOAD_SECRET` to a random string.

4. Start the dev server:
   ```sh
   npm run dev
   ```

5. Open [http://localhost:3000/admin](http://localhost:3000/admin) and create your first admin account.

6. Seed the site with the current content:
   ```sh
   npm run seed
   ```

7. Visit [http://localhost:3000](http://localhost:3000) to see the site.

## Admin Panel

Access the admin panel at **www.purduefuelinitiative.org/admin** (or `localhost:3000/admin` locally).

### Content Structure

| Section | What to edit | Where in admin |
|---------|-------------|----------------|
| Hero | Title, tagline, highlight text, join button URL, Instagram | Home Page > Hero Section |
| Events | Heading, Google Calendar embed URL | Home Page > Events Section |
| About | Heading, question, description, feature cards | Home Page > About Section |
| Programs | Heading, subtitle, program cards | Home Page > Programs Section |
| Contact | Heading, subheading, description, Instagram handle | Home Page > Contact Section |
| Navigation | Nav link labels and anchors | Site Settings > Navigation Links |
| SEO | Site title, meta description | Site Settings |
| Footer | Footer copyright text | Site Settings > Footer Text |

### Common Tasks

**Update the Google Calendar embed:**
1. Go to Home Page > Events Section
2. Paste the new embed URL from Google Calendar (Share > Embed)
3. Save

**Add/remove a program card:**
1. Go to Home Page > Programs Section > Program Cards
2. Click "Add Program Card" or click the X to remove one
3. Drag to reorder
4. Save

**Create accounts for new officers:**
1. Go to the Users collection in the admin sidebar
2. Click "Create New"
3. Enter their email and a password

## Production Deployment (www.purduefuelinitiative.org)

### 1. DNS (Namecheap)

Log in to Namecheap > Domain List > purduefuelinitiative.org > Advanced DNS. Set these records (remove any conflicting defaults):

| Type | Host | Value | TTL |
|------|------|-------|-----|
| A | `@` | `<VPS IP address>` | Automatic |
| A | `www` | `<VPS IP address>` | Automatic |

- The `@` record handles `purduefuelinitiative.org` (bare domain)
- The `www` record handles `www.purduefuelinitiative.org`
- If there are existing A records or CNAME records for `@` or `www`, delete them first
- DNS propagation can take up to 24-48 hours, but usually takes minutes. Verify with `dig purduefuelinitiative.org` or `nslookup purduefuelinitiative.org`

### 2. Clone and configure on VPS

```sh
git clone <your-repo> && cd pfi-web
cp .env.example .env
```

Edit `.env` for production:
```
DATABASE_URI=postgresql://postgres:<strong-password>@postgres:5432/pfi
PAYLOAD_SECRET=<run: openssl rand -hex 32>
NEXT_PUBLIC_SITE_URL=https://www.purduefuelinitiative.org
```

### 3. Start the app

```sh
docker compose up -d --build
```

### 4. Set up Nginx + SSL

```sh
sudo apt install nginx certbot python3-certbot-nginx
```

Copy the reference config:
```sh
sudo cp deploy/nginx.conf /etc/nginx/sites-available/pfi
sudo ln -s /etc/nginx/sites-available/pfi /etc/nginx/sites-enabled/
```

Get SSL certificates (do this before enabling the HTTPS server block):
```sh
sudo certbot --nginx -d purduefuelinitiative.org -d www.purduefuelinitiative.org
```

Test and reload:
```sh
sudo nginx -t && sudo systemctl reload nginx
```

The full Nginx config is in [`deploy/nginx.conf`](deploy/nginx.conf) and handles HTTP-to-HTTPS redirect, SSL, WebSocket upgrade for admin live preview, and a 100MB upload limit for media.

## Troubleshooting

**Site not loading:**
```sh
docker compose logs app     # check app logs
docker compose logs postgres # check database logs
docker compose restart       # restart everything
```

**Admin panel returns 500:**
- Check that `DATABASE_URI` is correct and Postgres is running
- Check that `PAYLOAD_SECRET` is set

**Forgot admin password:**
- Create a new user via the Payload CLI or directly in Postgres

## Tech Stack

- **Frontend:** Next.js 15 (React 19, App Router)
- **CMS:** Payload CMS v3 (admin panel + REST API)
- **Database:** PostgreSQL 16
- **Deployment:** Docker Compose + Nginx
