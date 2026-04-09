import fs from 'fs';

const data = JSON.parse(fs.readFileSync('src/data/endpoints.json', 'utf8'));

const newCategories = [
  {
    name: "Developer & Testing Tools",
    items: [
      { "JSONPlaceholder Posts": { desc: "Fake REST API for testing and prototyping (Posts).", path: "https://jsonplaceholder.typicode.com/posts" } },
      { "JSONPlaceholder Users": { desc: "Fake REST API for testing and prototyping (Users).", path: "https://jsonplaceholder.typicode.com/users" } },
      { "HTTPBin Get": { desc: "A simple HTTP Request & Response Service.", path: "https://httpbin.org/get" } },
      { "GitHub User Info": { desc: "Get public information about a GitHub user.", path: "https://api.github.com/users/octocat" } },
      { "NPM Package Info": { desc: "Get metadata about an NPM package.", path: "https://registry.npmjs.org/react" } },
      { "Reqres Users": { desc: "A hosted REST-API ready to respond to your AJAX requests.", path: "https://reqres.in/api/users?page=2" } }
    ]
  },
  {
    name: "Finance & Crypto",
    items: [
      { "CoinGecko Ping": { desc: "Check CoinGecko API server status.", path: "https://api.coingecko.com/api/v3/ping" } },
      { "Bitcoin Price (Coindesk)": { desc: "Get current Bitcoin price index.", path: "https://api.coindesk.com/v1/bpi/currentprice.json" } },
      { "Exchange Rates": { desc: "Free currency exchange rates.", path: "https://open.er-api.com/v6/latest/USD" } },
      { "Binance Ticker": { desc: "24hr ticker price change statistics for Binance.", path: "https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT" } }
    ]
  },
  {
    name: "Entertainment & Pop Culture",
    items: [
      { "PokeAPI (Pikachu)": { desc: "All the Pokémon data you'll ever need.", path: "https://pokeapi.co/api/v2/pokemon/pikachu" } },
      { "Rick and Morty Characters": { desc: "Get all characters from Rick and Morty.", path: "https://rickandmortyapi.com/api/character" } },
      { "Open Trivia Database": { desc: "Free to use, user-contributed trivia question database.", path: "https://opentdb.com/api.php?amount=10" } },
      { "Anime Facts": { desc: "Get random anime facts.", path: "https://anime-facts-rest-api.herokuapp.com/api/v1" } },
      { "Kanye Rest": { desc: "Random Kanye West quotes.", path: "https://api.kanye.rest/" } },
      { "Advice Slip": { desc: "Generate random advice slips.", path: "https://api.adviceslip.com/advice" } },
      { "Yes/No API": { desc: "Get a random yes or no answer with a gif.", path: "https://yesno.wtf/api" } },
      { "Studio Ghibli Films": { desc: "Access the Studio Ghibli catalog.", path: "https://ghibliapi.vercel.app/films" } }
    ]
  },
  {
    name: "Science & Weather",
    items: [
      { "NASA APOD": { desc: "Astronomy Picture of the Day (Demo Key).", path: "https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY" } },
      { "Spaceflight News": { desc: "Get the latest spaceflight news.", path: "https://api.spaceflightnewsapi.net/v4/articles" } },
      { "Open-Meteo Weather": { desc: "Free open-source weather API (London).", path: "https://api.open-meteo.com/v1/forecast?latitude=51.5085&longitude=-0.1257&current_weather=true" } },
      { "Universities List": { desc: "Search universities by country.", path: "http://universities.hipolabs.com/search?country=United+States" } }
    ]
  },
  {
    name: "More Utilities",
    items: [
      { "Free Dictionary API": { desc: "Get definitions, phonetics, and more.", path: "https://api.dictionaryapi.dev/api/v2/entries/en/hello" } },
      { "QR Code Generator": { desc: "Generate a QR code image.", path: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Example" } },
      { "Robohash": { desc: "Generate unique robot images from text.", path: "https://robohash.org/your-text-here" } },
      { "DiceBear Avatars": { desc: "Generate random SVG avatars.", path: "https://api.dicebear.com/7.x/pixel-art/svg?seed=John" } },
      { "Public APIs List": { desc: "A collective list of free APIs.", path: "https://api.publicapis.org/entries" } },
      { "CountAPI": { desc: "Count API for tracking page hits or events.", path: "https://api.countapi.xyz/hit/namespace/key" } }
    ]
  }
];

data.endpoints.push(...newCategories);

let total = 0;
data.endpoints.forEach(c => total += c.items.length);
data.totalfitur = total;

fs.writeFileSync('src/data/endpoints.json', JSON.stringify(data, null, 2));
console.log('Added ' + newCategories.reduce((acc, cat) => acc + cat.items.length, 0) + ' new endpoints.');
