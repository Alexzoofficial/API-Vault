import fs from 'fs';

const data = JSON.parse(fs.readFileSync('src/data/endpoints.json', 'utf8'));

const newCategories = [
  {
    name: "University & Education",
    items: [
      { "Hipo Universities": { desc: "Search universities around the world.", path: "http://universities.hipolabs.com/search?country=India" } },
      { "Crossref Works": { desc: "Access metadata for millions of scholarly articles.", path: "https://api.crossref.org/works?query=biology&rows=2" } },
      { "OpenAlex": { desc: "Open catalog of the global research system.", path: "https://api.openalex.org/works?search=artificial+intelligence" } },
      { "arXiv API": { desc: "Access to the arXiv e-print repository.", path: "http://export.arxiv.org/api/query?search_query=all:electron&start=0&max_results=1" } },
      { "Core API": { desc: "World's largest collection of open access research papers.", path: "https://core.ac.uk/api-v2/articles/search/machine+learning?page=1&pageSize=1" } }
    ]
  },
  {
    name: "Sports & Fitness",
    items: [
      { "Ergast F1": { desc: "Historical Formula One motor racing data.", path: "http://ergast.com/api/f1/current/last/results.json" } },
      { "TheRundown": { desc: "Real-time sports odds and scores.", path: "https://therundown.io/api/v1/sports" } },
      { "Sportmonks": { desc: "Sports data API for various sports.", path: "https://api.sportmonks.com/v3/core/sports" } },
      { "NHL Records": { desc: "NHL records and statistics.", path: "https://records.nhl.com/site/api/franchise" } },
      { "MLB Stats": { desc: "Major League Baseball statistics.", path: "https://statsapi.mlb.com/api/v1/teams" } }
    ]
  },
  {
    name: "News & Information",
    items: [
      { "Spaceflight News": { desc: "Latest news about spaceflight.", path: "https://api.spaceflightnewsapi.net/v4/articles" } },
      { "New York Times Archive": { desc: "NYT article archive (Requires Key, Demo).", path: "https://api.nytimes.com/svc/archive/v1/2019/1.json?api-key=DEMO_KEY" } },
      { "Guardian OpenPlatform": { desc: "The Guardian news API (Requires Key, Demo).", path: "https://content.guardianapis.com/search?api-key=test" } },
      { "Currents API": { desc: "Latest news from various sources.", path: "https://api.currentsapi.services/v1/latest-news" } },
      { "NewsAPI": { desc: "Search worldwide news (Requires Key).", path: "https://newsapi.org/v2/top-headlines?country=us&apiKey=DEMO_KEY" } }
    ]
  },
  {
    name: "Jobs & Careers",
    items: [
      { "The Muse": { desc: "Search for jobs, companies, and career advice.", path: "https://www.themuse.com/api/public/jobs?page=1" } },
      { "Arbeitnow": { desc: "Job board for Europe and remote jobs.", path: "https://www.arbeitnow.com/api/job-board-api" } },
      { "Remotive": { desc: "Remote jobs API.", path: "https://remotive.com/api/remote-jobs" } },
      { "Findwork": { desc: "Software engineering jobs.", path: "https://findwork.dev/api/jobs/" } },
      { "USAJobs": { desc: "US Government jobs API.", path: "https://data.usajobs.gov/api/search?Keyword=Software" } }
    ]
  },
  {
    name: "Machine Learning & AI",
    items: [
      { "Hugging Face Models": { desc: "List models available on Hugging Face.", path: "https://huggingface.co/api/models?limit=5" } },
      { "Hugging Face Datasets": { desc: "List datasets available on Hugging Face.", path: "https://huggingface.co/api/datasets?limit=5" } },
      { "Roboflow Universe": { desc: "Computer vision datasets and models.", path: "https://universe.roboflow.com/api/v1/search?query=cats" } },
      { "OpenAI Models": { desc: "List available OpenAI models (Requires Key).", path: "https://api.openai.com/v1/models" } },
      { "Clarifai": { desc: "Image and video recognition API.", path: "https://api.clarifai.com/v2/models" } }
    ]
  },
  {
    name: "Open Data & Government",
    items: [
      { "Data.gov": { desc: "US Government open data.", path: "https://catalog.data.gov/api/3/action/package_search?q=health" } },
      { "UK Police": { desc: "UK Police data including crimes and forces.", path: "https://data.police.uk/api/forces" } },
      { "World Bank": { desc: "Global development data.", path: "http://api.worldbank.org/v2/country/all/indicator/SP.POP.TOTL?format=json" } },
      { "OpenFEC": { desc: "US Federal Election Commission data.", path: "https://api.open.fec.gov/v1/candidates/?api_key=DEMO_KEY" } },
      { "Census.gov": { desc: "US Census Bureau data.", path: "https://api.census.gov/data/2020/dec/pl?get=NAME&for=state:*" } }
    ]
  },
  {
    name: "Transportation & Logistics",
    items: [
      { "BART API": { desc: "Bay Area Rapid Transit data.", path: "http://api.bart.gov/api/stn.aspx?cmd=stns&key=MW9S-E7SL-26DU-VV8V&json=y" } },
      { "TfL Unified": { desc: "Transport for London API.", path: "https://api.tfl.gov.uk/Line/Mode/tube/Status" } },
      { "OpenSky Network": { desc: "Real-time flight tracking data.", path: "https://opensky-network.org/api/states/all" } },
      { "Navitia": { desc: "Public transit routing and data.", path: "https://api.navitia.io/v1/coverage" } },
      { "WhereTheISSAt": { desc: "Current location of the International Space Station.", path: "https://api.wheretheiss.at/v1/satellites/25544" } }
    ]
  },
  {
    name: "Video Games & eSports",
    items: [
      { "RAWG Video Games": { desc: "Largest video game database.", path: "https://api.rawg.io/api/games?key=DEMO_KEY" } },
      { "CheapShark": { desc: "PC game deals and prices.", path: "https://www.cheapshark.com/api/1.0/deals?storeID=1&upperPrice=15" } },
      { "Free-To-Play Games": { desc: "List of free-to-play games.", path: "https://www.freetogame.com/api/games" } },
      { "Amiibo API": { desc: "Nintendo Amiibo database.", path: "https://www.amiiboapi.com/api/amiibo/" } },
      { "Dota 2 API": { desc: "OpenDota API for Dota 2 stats.", path: "https://api.opendota.com/api/heroes" } }
    ]
  },
  {
    name: "Blockchain & Cryptocurrency",
    items: [
      { "CoinCap": { desc: "Real-time cryptocurrency pricing and market data.", path: "https://api.coincap.io/v2/assets" } },
      { "CoinLore": { desc: "Cryptocurrency prices, volume, and market cap.", path: "https://api.coinlore.net/api/tickers/" } },
      { "KuCoin": { desc: "KuCoin cryptocurrency exchange API.", path: "https://api.kucoin.com/api/v1/market/allTickers" } },
      { "Kraken": { desc: "Kraken cryptocurrency exchange API.", path: "https://api.kraken.com/0/public/Assets" } },
      { "Mempool": { desc: "Bitcoin mempool and blockchain explorer.", path: "https://mempool.space/api/blocks/tip/height" } }
    ]
  },
  {
    name: "Photography & Imagery",
    items: [
      { "Unsplash": { desc: "Beautiful, free images and photos (Requires Key).", path: "https://api.unsplash.com/photos/random?client_id=DEMO_KEY" } },
      { "Pexels": { desc: "Free stock photos and videos (Requires Key).", path: "https://api.pexels.com/v1/search?query=nature" } },
      { "Pixabay": { desc: "Stunning free images and royalty free stock (Requires Key).", path: "https://pixabay.com/api/?key=DEMO_KEY&q=yellow+flowers" } },
      { "Giphy": { desc: "The largest GIF search engine (Requires Key).", path: "https://api.giphy.com/v1/gifs/trending?api_key=DEMO_KEY" } },
      { "Tenor": { desc: "GIF search and sharing (Requires Key).", path: "https://tenor.googleapis.com/v2/search?q=excited&key=DEMO_KEY" } }
    ]
  },
  {
    name: "Shopping & E-Commerce",
    items: [
      { "Fake Store API": { desc: "Fake store REST API for your e-commerce or shopping website prototype.", path: "https://fakestoreapi.com/products" } },
      { "Platzi Store": { desc: "Fake API for e-commerce.", path: "https://api.escuelajs.co/api/v1/products" } },
      { "Makeup API": { desc: "Makeup product information.", path: "http://makeup-api.herokuapp.com/api/v1/products.json?brand=maybelline" } },
      { "Stripe": { desc: "Payment processing API (Requires Key).", path: "https://api.stripe.com/v1/charges" } },
      { "Shopify": { desc: "E-commerce platform API (Requires Key).", path: "https://your-store.myshopify.com/admin/api/2023-10/products.json" } }
    ]
  },
  {
    name: "Test Data & Mocking",
    items: [
      { "Mockaroo": { desc: "Generate realistic test data (Requires Key).", path: "https://my.api.mockaroo.com/users.json?key=DEMO_KEY" } },
      { "JSON Server": { desc: "Get a full fake REST API with zero coding.", path: "https://my-json-server.typicode.com/typicode/demo/posts" } },
      { "Mocky": { desc: "Generate custom HTTP responses.", path: "https://run.mocky.io/v3/b5c829b4-9351-460a-9d0a-6652491a6296" } },
      { "Beeceptor": { desc: "Mock API and intercept HTTP requests.", path: "https://echo.free.beeceptor.com" } },
      { "Postman Echo": { desc: "Service to test REST clients and make sample API calls.", path: "https://postman-echo.com/get?foo1=bar1&foo2=bar2" } }
    ]
  },
  {
    name: "Dictionaries & Words",
    items: [
      { "Datamuse": { desc: "Word-finding query engine.", path: "https://api.datamuse.com/words?rel_rhy=forgetful" } },
      { "Merriam-Webster": { desc: "Dictionary and thesaurus (Requires Key).", path: "https://www.dictionaryapi.com/api/v3/references/collegiate/json/voluminous?key=DEMO_KEY" } },
      { "WordsAPI": { desc: "An API for English words (Requires Key).", path: "https://wordsapiv1.p.rapidapi.com/words/hatchback" } },
      { "Urban Dictionary": { desc: "Crowdsourced online dictionary for slang.", path: "http://api.urbandictionary.com/v0/define?term=wat" } },
      { "Rhymebrain": { desc: "Rhyming dictionary API.", path: "https://rhymebrain.com/talk?function=getRhymes&word=hello" } }
    ]
  },
  {
    name: "Calendar & Time",
    items: [
      { "World Time API": { desc: "Simple API to get the current time based on a request with a timezone.", path: "http://worldtimeapi.org/api/timezone/Europe/London" } },
      { "Nager.Date": { desc: "Public holidays for more than 90 countries.", path: "https://date.nager.at/api/v3/PublicHolidays/2023/US" } },
      { "Abstract Public Holidays": { desc: "Public holiday data (Requires Key).", path: "https://holidays.abstractapi.com/v1/?api_key=DEMO_KEY&country=US&year=2020" } },
      { "Calendarific": { desc: "Global holidays API (Requires Key).", path: "https://calendarific.com/api/v2/holidays?api_key=DEMO_KEY&country=US&year=2019" } },
      { "Hebcal": { desc: "Jewish calendar API.", path: "https://www.hebcal.com/hebcal?v=1&cfg=json&maj=on&min=on&mod=on&nx=on&year=now&month=x&ss=on&mf=on&c=on&geo=geoname&geonameid=3448439&m=50&s=on" } }
    ]
  },
  {
    name: "Math & Calculation",
    items: [
      { "Newton": { desc: "Advanced math API for symbolic computation.", path: "https://newton.now.sh/api/v2/simplify/2^2+2(2)" } },
      { "Math.js": { desc: "Extensive math library for JavaScript and Node.js.", path: "http://api.mathjs.org/v4/?expr=2*(7-3)" } },
      { "Numbers API": { desc: "Facts about numbers.", path: "http://numbersapi.com/42/math" } },
      { "ExchangeRate-API": { desc: "Currency conversion API.", path: "https://api.exchangerate-api.com/v4/latest/USD" } },
      { "Frankfurter": { desc: "Open-source currency data API.", path: "https://api.frankfurter.app/latest" } }
    ]
  },
  {
    name: "Geocoding & Maps",
    items: [
      { "Nominatim (OpenStreetMap)": { desc: "Search OSM data by name and address.", path: "https://nominatim.openstreetmap.org/search?q=London&format=json" } },
      { "Geocode.xyz": { desc: "Geocoding and geoparsing API.", path: "https://geocode.xyz/Seattle?json=1" } },
      { "Positionstack": { desc: "Forward and reverse geocoding (Requires Key).", path: "http://api.positionstack.com/v1/forward?access_key=DEMO_KEY&query=1600+Pennsylvania+Ave+NW,+Washington+DC" } },
      { "Geoapify": { desc: "Location APIs for mapping and routing (Requires Key).", path: "https://api.geoapify.com/v1/geocode/search?text=38+Upper+Montagu+Street,+London+W1H+1LJ,+United+Kingdom&apiKey=DEMO_KEY" } },
      { "Mapbox": { desc: "Maps, navigation, and search (Requires Key).", path: "https://api.mapbox.com/geocoding/v5/mapbox.places/Los%20Angeles.json?access_token=DEMO_KEY" } }
    ]
  },
  {
    name: "DNS & Network Tools",
    items: [
      { "Cloudflare DNS over HTTPS": { desc: "Resolve DNS queries over HTTPS.", path: "https://cloudflare-dns.com/dns-query?name=example.com&type=A" } },
      { "Google Public DNS": { desc: "Resolve DNS queries over HTTPS.", path: "https://dns.google/resolve?name=example.com&type=A" } },
      { "IP-API": { desc: "IP Geolocation API.", path: "http://ip-api.com/json/" } },
      { "ipinfo.io": { desc: "Comprehensive IP address data.", path: "https://ipinfo.io/json" } },
      { "Shodan": { desc: "Search engine for Internet-connected devices (Requires Key).", path: "https://api.shodan.io/shodan/host/8.8.8.8?key=DEMO_KEY" } }
    ]
  },
  {
    name: "Validation & Verification",
    items: [
      { "Abstract Email Validation": { desc: "Verify email addresses (Requires Key).", path: "https://emailvalidation.abstractapi.com/v1/?api_key=DEMO_KEY&email=test@gmail.com" } },
      { "Numverify": { desc: "Global phone number validation (Requires Key).", path: "http://apilayer.net/api/validate?access_key=DEMO_KEY&number=14158586273" } },
      { "VatLayer": { desc: "VAT number validation (Requires Key).", path: "http://apilayer.net/api/validate?access_key=DEMO_KEY&vat_number=LU26375245" } },
      { "MailboxLayer": { desc: "Email validation and verification (Requires Key).", path: "http://apilayer.net/api/check?access_key=DEMO_KEY&email=support@apilayer.com" } },
      { "ZeroBounce": { desc: "Email validation API (Requires Key).", path: "https://api.zerobounce.net/v2/validate?api_key=DEMO_KEY&email=valid@example.com" } }
    ]
  },
  {
    name: "Social Media & Engagement",
    items: [
      { "Twitter API v2": { desc: "Access Twitter data (Requires Key).", path: "https://api.twitter.com/2/tweets/20" } },
      { "Reddit API": { desc: "Access Reddit data.", path: "https://www.reddit.com/r/aww.json" } },
      { "YouTube Data API": { desc: "Access YouTube data (Requires Key).", path: "https://www.googleapis.com/youtube/v3/videos?id=7lCDEYXw3mM&key=DEMO_KEY&part=snippet,contentDetails,statistics,status" } },
      { "Twitch API": { desc: "Access Twitch data (Requires Key).", path: "https://api.twitch.tv/helix/games/top" } },
      { "Discord API": { desc: "Build Discord bots and apps (Requires Key).", path: "https://discord.com/api/v10/users/@me" } }
    ]
  }
];

data.endpoints.push(...newCategories);

let total = 0;
data.endpoints.forEach(c => total += c.items.length);
data.totalfitur = total;

fs.writeFileSync('src/data/endpoints.json', JSON.stringify(data, null, 2));
console.log('Added ' + newCategories.reduce((acc, cat) => acc + cat.items.length, 0) + ' new endpoints.');
