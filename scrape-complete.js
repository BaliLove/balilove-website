const { chromium } = require('playwright');
const fs = require('fs').promises;
const path = require('path');

async function scrapeBaliLove() {
  console.log('🚀 Starting complete bali.love scraping with Playwright...');
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const scraped = { pages: [], images: [], navigation: [] };
  
  try {
    // Navigate to homepage
    console.log('📡 Loading bali.love homepage...');
    await page.goto('https://bali.love', { waitUntil: 'networkidle', timeout: 45000 });
    
    // Get navigation links
    console.log('🔍 Extracting navigation...');
    const navigation = await page.evaluate(() => {
      const links = [];
      const selectors = [
        'nav a', '.header a', '.menu a', '.header-nav a', 
        '.main-navigation a', '.site-navigation a', '.nav-item a'
      ];
      
      selectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(link => {
          if (link.href && link.textContent?.trim() && link.href.includes('bali.love')) {
            links.push({ 
              url: link.href, 
              text: link.textContent.trim() 
            });
          }
        });
      });
      
      // Remove duplicates
      const unique = [];
      const seen = new Set();
      links.forEach(link => {
        if (!seen.has(link.url)) {
          unique.push(link);
          seen.add(link.url);
        }
      });
      
      return unique;
    });
    
    scraped.navigation = navigation;
    console.log(`📋 Found ${navigation.length} navigation links:`, navigation.map(n => n.text).join(', '));
    
    // Scrape homepage content
    console.log('📄 Extracting homepage content...');
    const homeData = await page.evaluate(() => {
      // Extract comprehensive content
      const headings = [];
      ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach(tag => {
        document.querySelectorAll(tag).forEach(heading => {
          const text = heading.textContent?.trim();
          if (text) headings.push({ level: tag, text: text });
        });
      });
      
      const paragraphs = Array.from(document.querySelectorAll('p, .content p, .sqs-block-content p'))
        .map(p => p.textContent?.trim())
        .filter(text => text && text.length > 10);
      
      const images = Array.from(document.querySelectorAll('img')).map(img => ({
        src: img.src,
        alt: img.alt || '',
        title: img.title || '',
        width: img.naturalWidth || img.width,
        height: img.naturalHeight || img.height
      })).filter(img => img.src && !img.src.includes('data:image'));
      
      const lists = [];
      document.querySelectorAll('ul, ol').forEach(list => {
        const items = Array.from(list.querySelectorAll('li')).map(li => li.textContent?.trim()).filter(Boolean);
        if (items.length > 0) {
          lists.push({ type: list.tagName.toLowerCase(), items: items });
        }
      });
      
      return {
        url: window.location.href,
        title: document.title,
        metaDescription: document.querySelector('meta[name="description"]')?.content || '',
        headings: headings,
        paragraphs: paragraphs,
        images: images,
        lists: lists,
        bodyClass: document.body.className
      };
    });
    
    scraped.pages.push(homeData);
    console.log(`✅ Homepage: ${homeData.title} (${homeData.paragraphs.length} paragraphs, ${homeData.images.length} images)`);
    
    // Scrape navigation pages
    for (const navItem of navigation) {
      console.log(`📄 Scraping: ${navItem.text} (${navItem.url})`);
      
      try {
        await page.goto(navItem.url, { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(2000);
        
        const pageData = await page.evaluate((url) => {
          const headings = [];
          ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach(tag => {
            document.querySelectorAll(tag).forEach(heading => {
              const text = heading.textContent?.trim();
              if (text) headings.push({ level: tag, text: text });
            });
          });
          
          const paragraphs = Array.from(document.querySelectorAll('p, .content p, .sqs-block-content p'))
            .map(p => p.textContent?.trim())
            .filter(text => text && text.length > 10);
          
          const images = Array.from(document.querySelectorAll('img')).map(img => ({
            src: img.src,
            alt: img.alt || '',
            title: img.title || ''
          })).filter(img => img.src && !img.src.includes('data:image'));
          
          return {
            url: url,
            title: document.title,
            metaDescription: document.querySelector('meta[name="description"]')?.content || '',
            headings: headings,
            paragraphs: paragraphs,
            images: images,
            pageType: 'navigation'
          };
        }, navItem.url);
        
        scraped.pages.push(pageData);
        console.log(`✅ ${navItem.text}: ${pageData.paragraphs.length} paragraphs, ${pageData.images.length} images`);
        
        // Collect unique images
        pageData.images.forEach(img => {
          if (!scraped.images.find(existing => existing.src === img.src)) {
            scraped.images.push(img);
          }
        });
        
      } catch (error) {
        console.error(`❌ Error scraping ${navItem.text}:`, error.message);
      }
      
      // Respectful delay
      await page.waitForTimeout(2000);
    }
    
    // Save results
    const outputDir = path.join(__dirname, 'scraped-content');
    await fs.mkdir(outputDir, { recursive: true });
    
    await fs.writeFile(
      path.join(outputDir, 'bali-love-complete.json'),
      JSON.stringify(scraped, null, 2)
    );
    
    await fs.writeFile(
      path.join(outputDir, 'pages.json'),
      JSON.stringify(scraped.pages, null, 2)
    );
    
    await fs.writeFile(
      path.join(outputDir, 'images.json'),
      JSON.stringify(scraped.images, null, 2)
    );
    
    // Create summary
    const summary = {
      totalPages: scraped.pages.length,
      totalImages: scraped.images.length,
      navigationItems: scraped.navigation.length,
      scrapedAt: new Date().toISOString(),
      pages: scraped.pages.map(p => ({
        title: p.title,
        url: p.url,
        contentBlocks: p.paragraphs.length,
        images: p.images.length
      }))
    };
    
    await fs.writeFile(
      path.join(outputDir, 'summary.json'),
      JSON.stringify(summary, null, 2)
    );
    
    console.log('💾 Results saved to scraped-content/');
    console.log('📊 Summary:');
    console.log(`- Pages: ${summary.totalPages}`);
    console.log(`- Images: ${summary.totalImages}`);
    console.log(`- Navigation: ${summary.navigationItems}`);
    
  } catch (error) {
    console.error('❌ Scraping failed:', error.message);
  } finally {
    await browser.close();
  }
}

scrapeBaliLove();