const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

async function downloadSitemap() {
  const url = `${process.env.REACT_APP_API_URL}/sitemap.xml`;
  const destPath = path.join(__dirname, '../public/sitemap.xml');

  console.log('Downloading sitemap from', url);

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to download sitemap: ${res.statusText}`);
  }

  const xml = await res.text();

  fs.writeFileSync(destPath, xml);
  console.log('Sitemap saved to', destPath);
}

downloadSitemap().catch((err) => {
  console.error(err);
  process.exit(1);
});
