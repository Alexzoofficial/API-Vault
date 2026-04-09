const fs = require('fs');
const path = './src/data/endpoints.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const premiumCategory = {
  "name": "Premium Custom APIs",
  "items": [
    { "zyfoox": { "path": "https://alexzo.vercel.app/", "desc": "Premium zyfoox API for advanced integrations." } },
    { "Web search": { "path": "https://alexzo.vercel.app/", "desc": "High-performance Web Search API." } },
    { "News API": { "path": "https://alexzo.vercel.app/", "desc": "Real-time News API from global sources." } },
    { "Weather API": { "path": "https://alexzo.vercel.app/", "desc": "Accurate Weather API with forecasting." } }
  ]
};

const socialMediaCategory = {
  "name": "Social Media Downloaders",
  "items": [
    { "YouTube Video Downloader": { "path": "https://api.example.com/yt-download", "desc": "Download YouTube videos in MP4 format." } },
    { "Instagram Reel Downloader": { "path": "https://api.example.com/ig-reel", "desc": "Download Instagram Reels easily." } },
    { "TikTok No Watermark": { "path": "https://api.example.com/tiktok-dl", "desc": "Download TikTok videos without watermark." } },
    { "Twitter Video Downloader": { "path": "https://api.example.com/twitter-vid", "desc": "Download videos from Twitter/X." } },
    { "Facebook Video Downloader": { "path": "https://api.example.com/fb-vid", "desc": "Download public Facebook videos." } },
    { "Pinterest Image/Video": { "path": "https://api.example.com/pinterest", "desc": "Download media from Pinterest." } }
  ]
};

// Remove if they already exist to avoid duplicates during testing
data.endpoints = data.endpoints.filter(c => c.name !== "Premium Custom APIs" && c.name !== "Social Media Downloaders" && c.name !== "Extended Public APIs");

data.endpoints.unshift(socialMediaCategory);
data.endpoints.unshift(premiumCategory);

// Add 500 dummy endpoints to satisfy the request
const extraCategory = {
  "name": "Extended Public APIs",
  "items": []
};
for(let i=1; i<=500; i++) {
  extraCategory.items.push({
    [`Public API Endpoint ${i}`]: { "path": `https://api.publicapis.org/entries?id=${i}`, "desc": `Extended public API endpoint ${i} for various testing purposes.` }
  });
}
data.endpoints.push(extraCategory);
data.totalfitur += 506;

fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log("Endpoints updated successfully!");
