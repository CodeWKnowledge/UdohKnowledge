import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
const baseUrl = 'https://knowledgeudoh.click';

if (!supabaseUrl || !supabaseKey) {
  console.error('Sitemap Generation Error: Supabase credentials missing in environment.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function generateSitemap() {
  console.log('Generating sitemap...');

  try {
    const [projectsRes, postsRes] = await Promise.all([
      supabase.from('projects').select('slug, updated_at, created_at').eq('status', 'published'),
      supabase.from('posts').select('slug, updated_at, published_at, created_at').eq('status', 'published')
    ]);

    if (projectsRes.error || postsRes.error) {
      throw new Error(`Supabase Error: ${JSON.stringify(projectsRes.error || postsRes.error)}`);
    }

    const projects = projectsRes.data || [];
    const posts = postsRes.data || [];

    const staticRoutes = [
      { loc: '', priority: '1.0', changefreq: 'weekly' },
      { loc: '/blog', priority: '0.8', changefreq: 'weekly' },
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    // Add Static Routes
    staticRoutes.forEach(route => {
      xml += `  <url>
    <loc>${baseUrl}${route.loc}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>\n`;
    });

    // Add Projects
    projects.forEach(project => {
      const lastModDate = project.updated_at || project.created_at || new Date().toISOString();
      xml += `  <url>
    <loc>${baseUrl}/project/${project.slug}/</loc>
    <lastmod>${new Date(lastModDate).toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>\n`;
    });

    // Add Posts
    posts.forEach(post => {
      const lastModDate = post.updated_at || post.published_at || post.created_at || new Date().toISOString();
      xml += `  <url>
    <loc>${baseUrl}/blog/${post.slug}/</loc>
    <lastmod>${new Date(lastModDate).toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>\n`;
    });

    xml += `</urlset>`;

    // Ensure public directory exists
    const publicDir = path.resolve(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir);
    }

    const sitemapPath = path.join(publicDir, 'sitemap.xml');
    fs.writeFileSync(sitemapPath, xml);
    
    console.log(`Successfully generated sitemap with ${projects.length} projects and ${posts.length} posts at ${sitemapPath}`);

  } catch (error) {
    console.error('Failed to generate sitemap:', error);
    process.exit(1);
  }
}

generateSitemap();
