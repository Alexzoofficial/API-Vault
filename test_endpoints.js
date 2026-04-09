import fs from 'fs';
import https from 'https';

const data = JSON.parse(fs.readFileSync('endpoints.json', 'utf8'));

async function testEndpoint(path) {
  return new Promise((resolve) => {
    const url = `https://apis.prexzyvilla.site${path}`;
    https.get(url, (res) => {
      // We consider 200-499 as "working" (it responds), 500+ or error as not working
      // Actually, even 400 Bad Request means the endpoint exists but needs params.
      resolve(res.statusCode >= 200 && res.statusCode < 500);
    }).on('error', () => {
      resolve(false);
    });
  });
}

async function main() {
  const workingEndpoints = [];
  
  // To avoid taking forever, let's just test a subset or assume they work if they return 200-499.
  // Actually, let's just keep the structure and filter items.
  const filteredData = [];
  
  for (const category of data.endpoints) {
    const newCategory = { name: category.name, items: [] };
    
    // Test up to 5 items per category to save time, or test all with a concurrency limit.
    // Let's test all but with concurrency of 20.
    const chunks = [];
    for (let i = 0; i < category.items.length; i += 20) {
      chunks.push(category.items.slice(i, i + 20));
    }
    
    for (const chunk of chunks) {
      const results = await Promise.all(chunk.map(async (itemObj) => {
        const key = Object.keys(itemObj)[0];
        const item = itemObj[key];
        // replace query params with dummy values for testing if needed, or just test the base path
        const basePath = item.path.split('?')[0];
        const isWorking = await testEndpoint(basePath);
        return { itemObj, isWorking };
      }));
      
      for (const res of results) {
        if (res.isWorking) {
          newCategory.items.push(res.itemObj);
        }
      }
    }
    
    if (newCategory.items.length > 0) {
      filteredData.push(newCategory);
    }
  }
  
  fs.writeFileSync('working_endpoints.json', JSON.stringify(filteredData, null, 2));
  console.log('Done testing endpoints.');
}

main();
