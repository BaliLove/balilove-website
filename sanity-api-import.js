/**
 * Sanity API Content Importer
 * Directly imports all migrated content via Sanity HTTP API
 */

const fs = require('fs').promises;
const path = require('path');

class SanityAPIImporter {
  constructor(projectId, dataset, token) {
    this.projectId = projectId;
    this.dataset = dataset;
    this.token = token;
    this.baseUrl = `https://${projectId}.api.sanity.io/v2024-01-01/data/mutate/${dataset}`;
  }

  async importContent() {
    console.log('🚀 Starting Sanity API import...');
    console.log(`📡 Project: ${this.projectId}, Dataset: ${this.dataset}`);

    try {
      // Load migration data
      const migrationDir = path.join(__dirname, 'sanity-import');
      const completeData = await fs.readFile(
        path.join(migrationDir, 'complete-migration.json'),
        'utf8'
      );
      const content = JSON.parse(completeData);

      // Prepare mutations for bulk import
      const mutations = [];

      // Add pages
      content.pages.forEach(page => {
        mutations.push({
          create: {
            _type: page._type,
            _id: page._id,
            ...page
          }
        });
      });

      // Add wedding packages if any
      if (content.weddingPackages) {
        content.weddingPackages.forEach(pkg => {
          mutations.push({
            create: {
              _type: pkg._type,
              _id: pkg._id,
              ...pkg
            }
          });
        });
      }

      // Add venues if any
      if (content.venues) {
        content.venues.forEach(venue => {
          mutations.push({
            create: {
              _type: venue._type,
              _id: venue._id,
              ...venue
            }
          });
        });
      }

      // Add tours if any
      if (content.tours) {
        content.tours.forEach(tour => {
          mutations.push({
            create: {
              _type: tour._type,
              _id: tour._id,
              ...tour
            }
          });
        });
      }

      console.log(`📦 Prepared ${mutations.length} documents for import`);

      // Import in batches (Sanity has limits)
      const batchSize = 50;
      for (let i = 0; i < mutations.length; i += batchSize) {
        const batch = mutations.slice(i, i + batchSize);
        
        console.log(`📤 Importing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(mutations.length/batchSize)} (${batch.length} documents)`);
        
        const response = await fetch(this.baseUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
          },
          body: JSON.stringify({ mutations: batch })
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Sanity API error: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        console.log(`✅ Batch imported: ${result.results?.length || 0} documents`);
        
        // Small delay between batches
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      console.log('🎉 All content imported successfully!');
      
      // Save import log
      const importLog = {
        importedAt: new Date().toISOString(),
        projectId: this.projectId,
        dataset: this.dataset,
        totalDocuments: mutations.length,
        pages: content.pages.length,
        weddingPackages: content.weddingPackages?.length || 0,
        venues: content.venues?.length || 0,
        tours: content.tours?.length || 0,
        images: content.images?.length || 0
      };

      await fs.writeFile(
        path.join(__dirname, 'import-log.json'),
        JSON.stringify(importLog, null, 2)
      );

      return importLog;

    } catch (error) {
      console.error('❌ Import failed:', error.message);
      throw error;
    }
  }

  async uploadImages() {
    console.log('📸 Starting image upload to Sanity CDN...');
    
    try {
      const migrationDir = path.join(__dirname, 'sanity-import');
      const imagesData = await fs.readFile(
        path.join(migrationDir, 'images.ndjson'),
        'utf8'
      );
      
      const images = imagesData.trim().split('\n').map(line => JSON.parse(line));
      console.log(`📷 Found ${images.length} images to upload`);

      const uploadedImages = [];

      for (let i = 0; i < Math.min(images.length, 10); i++) { // Limit to first 10 for testing
        const image = images[i];
        console.log(`📤 Uploading image ${i + 1}/${Math.min(images.length, 10)}: ${image.originalFilename}`);
        
        try {
          // Fetch image from original URL
          const imageResponse = await fetch(image.url);
          if (!imageResponse.ok) {
            console.log(`⚠️  Failed to fetch ${image.url}`);
            continue;
          }

          const imageBuffer = await imageResponse.arrayBuffer();
          
          // Upload to Sanity
          const uploadUrl = `https://${this.projectId}.api.sanity.io/v2024-01-01/assets/images/${this.dataset}`;
          
          const uploadResponse = await fetch(uploadUrl, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${this.token}`,
              'Content-Type': imageResponse.headers.get('content-type') || 'image/jpeg'
            },
            body: imageBuffer
          });

          if (uploadResponse.ok) {
            const uploadResult = await uploadResponse.json();
            uploadedImages.push({
              originalUrl: image.url,
              sanityId: uploadResult.document._id,
              filename: image.originalFilename
            });
            console.log(`✅ Uploaded: ${image.originalFilename}`);
          } else {
            console.log(`❌ Upload failed: ${image.originalFilename}`);
          }

        } catch (error) {
          console.log(`❌ Error uploading ${image.originalFilename}:`, error.message);
        }
        
        // Delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      console.log(`📸 Image upload complete: ${uploadedImages.length} images uploaded`);
      
      // Save upload log
      await fs.writeFile(
        path.join(__dirname, 'image-upload-log.json'),
        JSON.stringify(uploadedImages, null, 2)
      );

      return uploadedImages;

    } catch (error) {
      console.error('❌ Image upload failed:', error.message);
      throw error;
    }
  }
}

// Usage function
async function runSanityImport() {
  // You'll need to provide these values from your Sanity project
  const projectId = process.env.SANITY_PROJECT_ID || 'YOUR_PROJECT_ID';
  const dataset = process.env.SANITY_DATASET || 'production';
  const token = process.env.SANITY_TOKEN || 'YOUR_WRITE_TOKEN';

  if (!projectId || projectId === 'YOUR_PROJECT_ID') {
    console.log('❌ Please set your Sanity project details:');
    console.log('   SANITY_PROJECT_ID=your-project-id');
    console.log('   SANITY_DATASET=production');
    console.log('   SANITY_TOKEN=your-write-token');
    console.log('');
    console.log('💡 Get these from: https://sanity.io/manage');
    return;
  }

  const importer = new SanityAPIImporter(projectId, dataset, token);
  
  try {
    // Import content documents
    const importLog = await importer.importContent();
    console.log('📋 Import Summary:', importLog);
    
    // Upload sample images (first 10)
    console.log('📸 Starting sample image upload...');
    const imageLog = await importer.uploadImages();
    console.log('🖼️  Image Upload Summary:', imageLog.length, 'images uploaded');
    
    console.log('🎉 Complete import finished!');
    console.log('🎯 Next: Review content in Sanity Studio');
    
  } catch (error) {
    console.error('❌ Import process failed:', error.message);
  }
}

// Export for use
module.exports = { SanityAPIImporter, runSanityImport };

// Run if called directly
if (require.main === module) {
  runSanityImport();
}