# SEO Documentation & Implementation Guide

This guide explains how SEO is implemented in the **Knowledge-Udoh** project and provides instructions for maintaining and improving the site's search engine visibility.

## 1. Current Implementation Overview

The project uses a centralized **Site Manager** (located in `src/App.jsx`) to handle SEO dynamically. This approach ensures that every route has unique, relevant metadata without needing third-party libraries like React Helmet.

### Features:
- **Dynamic Titles & Meta Descriptions**: Automatically updated based on the current route and data from Supabase.
- **Canonical Tags**: Automatically generated to prevent duplicate content issues.
- **Open Graph (OG) & Twitter Cards**: Comprehensive support for social sharing (titles, descriptions, images).
- **JSON-LD Structured Data**: Route-specific structured data (Schema.org) is injected for the homepage (Person/Organization), blog posts (BlogPosting), and projects (CreativeWork).
- **Heading Hierarchy**: Optimized `H1-H6` structure across all main components.

---

## 2. Managing Metadata

### Dynamic Content (Blogs & Projects)
Metadata for blog posts and projects is pulled directly from the Supabase database.
- **Titles**: Uses the `title` field.
- **Descriptions**: For blog posts, the first 160 characters of content are extracted. For projects, the `description` field is used.
- **Images**: Uses the `image_url` field for OG and Twitter previews.

### Updating Static Meta
To update the default/fallback metadata, modify the `SiteManager` component in `src/App.jsx`.

---

## 3. Sitemap & Robots.txt

### Sitemap (`public/sitemap.xml`)
The sitemap is now **automatically generated** from your live Supabase data.
- **How it works**: A script in `scripts/generate-sitemap.js` fetches all your projects and blog posts and builds the XML structure.
- **How to update**: Run `npm run generate-sitemap` manually, or just run `npm run build`, which automatically triggers the generation.
- **Configuration**: You can adjust priorities and change frequencies in `scripts/generate-sitemap.js`.

### Robots.txt (`public/robots.txt`)
- **Allow**: All public routes and `/blog`.
- **Disallow**: `/admin` and all admin-related subpaths.
- **Sitemap Link**: Points to `https://knowledgeudoh.click/sitemap.xml`.

---

## 4. Best Practices for New Content

When adding new blog posts or projects via the Admin Dashboard:
1. **Descriptive Titles**: Use clear, keyword-rich titles.
2. **Alt Text for Images**: Ensure images have descriptive alt text (handled automatically in most components using the title).
3. **Internal Linking**: Link between related projects and blog posts to improve crawlability.
4. **Keyword Density**: Write naturally, but ensure primary keywords (e.g., "Frontend Engineer", "Web Agency") appear in the content.

---

## 5. Tool Integration

### Google Search Console
1. Go to [Google Search Console](https://search.google.com/search-console).
2. Add your domain (`knowledgeudoh.click`).
3. Choose **URL Prefix** or **Domain** verification.
4. If using URL Prefix, download the HTML verification file and place it in the `public/` folder of this project, then deploy.
5. Submit your sitemap: `https://knowledgeudoh.click/sitemap.xml`.

### Google Analytics (GA4)
1. Create a GA4 property in the [Google Analytics Admin](https://analytics.google.com/).
2. Get your **Measurement ID** (e.g., `G-XXXXXXXXXX`).
3. To integrate, add the following script to the `<head>` of `index.html`:
```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## 6. Technical Checklist
- [x] No mixed content (HTTPS enforced).
- [x] Proper 404 page implemented.
- [x] Mobile responsive design.
- [x] Optimized image loading (`loading="lazy"`).
- [x] Unique IDs for interactive elements.
