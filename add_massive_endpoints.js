import fs from 'fs';

const data = JSON.parse(fs.readFileSync('src/data/endpoints.json', 'utf8'));

const newCategories = [
  {
    name: "Temp Numbers & SMS",
    items: [
      { "Textbelt Quota Check": { desc: "Check remaining free SMS quota on Textbelt.", path: "https://textbelt.com/quota/textbelt" } },
      { "Fake Identity Generator": { desc: "Generate a fake identity including a temporary phone number.", path: "https://api.namefake.com/" } },
      { "Random User (With Phone)": { desc: "Generate a random user profile with a phone number.", path: "https://randomuser.me/api/?inc=name,phone,cell,email" } },
      { "Twilio Pricing (US)": { desc: "Get public Twilio SMS pricing for the US.", path: "https://pricing.twilio.com/v1/Messaging/Countries/US" } }
    ]
  },
  {
    name: "Books & Literature",
    items: [
      { "Gutendex (Gutenberg)": { desc: "Search over 70,000 free e-books.", path: "https://gutendex.com/books/" } },
      { "Open Library Search": { desc: "Search books by title, author, or subject.", path: "https://openlibrary.org/search.json?q=the+lord+of+the+rings" } },
      { "PoetryDB": { desc: "Get poems by author or title.", path: "https://poetrydb.org/title/Ozymandias/lines.json" } },
      { "Quran API": { desc: "Free Quran API.", path: "https://api.alquran.cloud/v1/quran/en.asad" } },
      { "Bible API": { desc: "Free Bible API.", path: "https://bible-api.com/john%203:16" } }
    ]
  },
  {
    name: "Animals & Nature",
    items: [
      { "Random Fox": { desc: "Get a random fox image.", path: "https://randomfox.ca/floof/" } },
      { "Cataas (Cat as a Service)": { desc: "Get a random cat image.", path: "https://cataas.com/cat?json=true" } },
      { "Dog Breeds List": { desc: "List of all dog breeds.", path: "https://dog.ceo/api/breeds/list/all" } },
      { "MeowFacts": { desc: "Random cat facts.", path: "https://meowfacts.herokuapp.com/" } },
      { "PlaceBear": { desc: "Placeholder bear images.", path: "https://placebear.com/200/300" } }
    ]
  },
  {
    name: "Health & Food",
    items: [
      { "OpenBreweryDB": { desc: "List of breweries, cideries, and more.", path: "https://api.openbrewerydb.org/breweries" } },
      { "Fruityvice": { desc: "Data about all kinds of fruit.", path: "https://www.fruityvice.com/api/fruit/all" } },
      { "Foodish": { desc: "Random food images.", path: "https://foodish-api.com/api/" } }
    ]
  },
  {
    name: "Security & Network",
    items: [
      { "HackerNews Top Stories": { desc: "Get top stories from HackerNews.", path: "https://hacker-news.firebaseio.com/v0/topstories.json" } },
      { "MAC Address Vendor": { desc: "Lookup vendor by MAC address.", path: "https://api.macvendors.com/FC:A1:3E:2A:1C:33" } },
      { "IPify": { desc: "Get your public IP address.", path: "https://api.ipify.org?format=json" } },
      { "Zippopotam": { desc: "Get location data by zip code.", path: "https://api.zippopotam.us/us/90210" } }
    ]
  },
  {
    name: "Art & Design",
    items: [
      { "Art Institute of Chicago": { desc: "Access artwork data.", path: "https://api.artic.edu/api/v1/artworks" } },
      { "Lorem Picsum": { desc: "The Lorem Ipsum for photos.", path: "https://picsum.photos/v2/list" } }
    ]
  },
  {
    name: "Music & Audio",
    items: [
      { "iTunes Search": { desc: "Search the iTunes store.", path: "https://itunes.apple.com/search?term=jack+johnson" } }
    ]
  },
  {
    name: "Vehicles & Transport",
    items: [
      { "NHTSA Vehicle API": { desc: "Get vehicle makes and models.", path: "https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=json" } },
      { "CityBikes API": { desc: "CityBikes API for bike sharing data.", path: "http://api.citybik.es/v2/networks" } }
    ]
  }
];

data.endpoints.push(...newCategories);

let total = 0;
data.endpoints.forEach(c => total += c.items.length);
data.totalfitur = total;

fs.writeFileSync('src/data/endpoints.json', JSON.stringify(data, null, 2));
console.log('Added ' + newCategories.reduce((acc, cat) => acc + cat.items.length, 0) + ' new endpoints.');
