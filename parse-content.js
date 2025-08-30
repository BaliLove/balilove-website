const fs = require('fs');
const html = fs.readFileSync('homepage.html', 'utf8');

// Extract basic content structure
const titleMatch = html.match(/<title>(.*?)<\/title>/i);
const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
const metaDesc = html.match(/<meta name="description" content="(.*?)"/i);

console.log('🏠 Bali Love Homepage Content:');
console.log('Title:', titleMatch ? titleMatch[1] : 'Not found');
console.log('H1:', h1Match ? h1Match[1] : 'Not found');  
console.log('Meta Description:', metaDesc ? metaDesc[1] : 'Not found');

// Create initial content structure
const contentStructure = {
  homepage: {
    title: titleMatch ? titleMatch[1] : 'Bali Love',
    h1: h1Match ? h1Match[1] : '',
    metaDescription: metaDesc ? metaDesc[1] : '',
    url: 'https://bali.love'
  },
  timestamp: new Date().toISOString()
};

fs.writeFileSync('content-structure.json', JSON.stringify(contentStructure, null, 2));
console.log('✅ Content structure saved to content-structure.json');
