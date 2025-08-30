const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

async function scrapeBaliLove() {
  console.log('🚀 Starting bali.love scraping...');
  
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  const scraped = { pages: [], images: [], navigation: [] };
  
  try {
    // Navigate to homepage
    await page.goto('https://bali.love', { waitUntil: 'networkidle0' });
    
    // Get navigation links
    const navigation = await page.evaluate(() => {
      const links = [];
      document.querySelectorAll('nav a, .header a, .menu a').forEach(link => {
        if (link.href && link.textContent?.trim()) {
          links.push({ url: link.href, text: link.textContent.trim() });
        }
      });
      return links;
    });
    
    scraped.navigation = navigation;
    console.log(`Found ${navigation.length} navigation links`);
    
    // Scrape homepage
    const homeData = await page.evaluate(() => ({
      url: window.location.href,
      title: document.title,
      h1: document.querySelector('h1')?.textContent || '',
      content: Array.from(document.querySelectorAll('p, h2, h3')).map(el => el.textContent?.trim()).filter(Boolean),
      images: Array.from(document.querySelectorAll('img')).map(img => ({
        src: img.src,
        alt: img.alt || ''
      }))
    }));
    
    scraped.pages.push(homeData);
    console.log('✅ Scraped homepage');
    
    // Save results
    const outputDir = path.join(__dirname, 'scraped-content');
    await fs.mkdir(outputDir, { recursive: true });
    
    await fs.writeFile(
      path.join(outputDir, 'bali-love-content.json'),
      JSON.stringify(scraped, null, 2)
    );
    
    console.log('💾 Results saved to scraped-content/');
    console.log('📊 Pages scraped:', scraped.pages.length);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

scrapeBaliLove();
