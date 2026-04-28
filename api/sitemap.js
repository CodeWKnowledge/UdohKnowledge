import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  try {
    // 1. Initialize Supabase Client
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
    const baseUrl = 'https://knowledgeudoh.click';

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // 2. Default XML (Empty Sitemap) for Failsafe
    const emptySitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`;

    // 3. Fetch Data with Strict Rules
    const [projectsRes, postsRes] = await Promise.all([
      supabase
        .from('projects')
        .select('id, slug, updated_at'),
      supabase
        .from('posts')
        .select('slug, published_at')
    ]);

    if (projectsRes.error || postsRes.error) {
       console.error('Supabase Error:', projectsRes.error || postsRes.error);
       throw new Error('Supabase fetch failed');
    }

    const projects = projectsRes.data || [];
    const posts = postsRes.data || [];

    // 4. Build XML Content
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
      const identifier = project.slug || project.id;
      const lastModDate = project.updated_at || new Date().toISOString();
      xml += `  <url>
    <loc>${baseUrl}/project/${identifier}/</loc>
    <lastmod>${new Date(lastModDate).toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>\n`;
    });

    // Add Posts
    posts.forEach(post => {
      const lastModDate = post.published_at || new Date().toISOString();
      xml += `  <url>
    <loc>${baseUrl}/blog/${post.slug}/</loc>
    <lastmod>${new Date(lastModDate).toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>\n`;
    });

    xml += `</urlset>`;

    // 5. Set Headers (STRICT ENFORCEMENT)
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    
    // Ensure NO Content-Disposition is set. 
    // We explicitly avoid setting it. 
    // If the platform injects it, setting a correct Content-Type often bypasses it for non-file extensions.
    
    // 6. Send Response
    return res.status(200).send(xml);

  } catch (error) {
    console.error('Sitemap Generation Failsafe Triggered:', error);
    
    // 7. Failsafe: Return valid empty sitemap on any error
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    return res.status(200).send(emptySitemap);
  }
}
