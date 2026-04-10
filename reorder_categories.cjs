const fs = require('fs');
const path = 'src/data/endpoints.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const aiCategoryName = "Artificial Intelligence";
const downloaderCategoryNames = ["Social Media Downloaders", "Downloader"];

let aiCategory = null;
let downloaderCategories = [];
let otherCategories = [];

data.endpoints.forEach(cat => {
  if (cat.name === aiCategoryName) {
    aiCategory = cat;
  } else if (downloaderCategoryNames.includes(cat.name)) {
    downloaderCategories.push(cat);
  } else {
    otherCategories.push(cat);
  }
});

// New order: AI first, then others, then Downloaders
const newEndpoints = [];
if (aiCategory) newEndpoints.push(aiCategory);
newEndpoints.push(...otherCategories);
newEndpoints.push(...downloaderCategories);

data.endpoints = newEndpoints;

fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log('Categories reordered successfully');
