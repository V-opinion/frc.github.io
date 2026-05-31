const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://a-multi-religion-election.multireligionvalsystem.eu.org';
const HTML_DIR = './public'; // Change to the directory containing your HTML files
const OUTPUT_FILE = './public/sitemap.xml'; // Where to save sitemap

function scanHtmlFiles(dir, baseUrl = SITE_URL) {
  let urls = [];
  function walk(currentDir) {
    fs.readdirSync(currentDir).forEach(file => {
      const fullPath = path.join(currentDir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        walk(fullPath);
      } else if (file.endsWith('.html')) {
        let urlPath = path.relative(HTML_DIR, fullPath).replace(/\\/g, '/');
        // Remove index.html for the root
        if (urlPath === 'index.html') urlPath = '';
        urls.push(`${baseUrl}/${urlPath}`.replace(/\/$/, ''));
      }
    });
  }
  walk(dir);
  return urls;
}

function buildSitemap(urls) {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  urls.forEach(url => {
    xml += `  <url>\n    <loc>${url}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
  });
  xml += `</urlset>\n`;
  return xml;
}

// Main
const urls = scanHtmlFiles(HTML_DIR);
const sitemap = buildSitemap(urls);
fs.writeFileSync(OUTPUT_FILE, sitemap, 'utf8');
console.log(`sitemap.xml generated with ${urls.length} URLs.`);
