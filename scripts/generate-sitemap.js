import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const baseUrl = 'https://knowledgeudoh.click';

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function generateSitemap() {
  try {
    console.log('Fetching projects and posts from Supabase...');
    
    const { data: projects } = await supabase.from('projects').select('id, slug, updated_at');
    const { data: posts } = await supabase.from('posts').select('slug, published_at');

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
    projects?.forEach(project => {
      const identifier = project.slug || project.id;
      xml += `  <url>
    <loc>${baseUrl}/project/${identifier}/</loc>
    <lastmod>${new Date(project.updated_at || Date.now()).toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>\n`;
    });

    // Add Posts
    posts?.forEach(post => {
      xml += `  <url>
    <loc>${baseUrl}/blog/${post.slug}/</loc>
    <lastmod>${new Date(post.published_at || Date.now()).toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>\n`;
    });

    xml += `</urlset>`;

    fs.writeFileSync('./public/sitemap.txt', xml);
    console.log('Sitemap generated successfully at ./public/sitemap.txt');
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }
}

generateSitemap();
