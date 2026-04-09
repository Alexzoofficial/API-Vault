import fs from 'fs';

const data = JSON.parse(fs.readFileSync('src/data/endpoints.json', 'utf8'));

// Regex to match emojis
const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2B50}\u{2B55}\u{231A}\u{231B}\u{23E9}-\u{23EC}\u{23F0}\u{23F3}\u{25FD}\u{25FE}\u{2614}\u{2615}\u{2648}-\u{2653}\u{267F}\u{2693}\u{26A1}\u{26AA}\u{26AB}\u{26BD}\u{26BE}\u{26C4}\u{26C5}\u{26CE}\u{26D4}\u{26EA}\u{26F2}\u{26F3}\u{26F5}\u{26FA}\u{26FD}\u{2705}\u{270A}-\u{270D}\u{2728}\u{274C}\u{274E}\u{2753}-\u{2755}\u{2757}\u{2795}-\u{2797}\u{27B0}\u{27BF}\u{2934}\u{2935}\u{2B05}-\u{2B07}\u{2B1B}\u{2B1C}\u{2B50}\u{2B55}\u{3030}\u{303D}\u{3297}\u{3299}\u{FE0F}]/gu;

function removeEmojis(str) {
  return str.replace(emojiRegex, '').trim();
}

// Clean up existing endpoints
if (data.endpoints) {
  data.endpoints.forEach(category => {
    category.name = removeEmojis(category.name);
    category.items.forEach(itemObj => {
      const oldKey = Object.keys(itemObj)[0];
      const newKey = removeEmojis(oldKey);
      if (oldKey !== newKey) {
        itemObj[newKey] = itemObj[oldKey];
        delete itemObj[oldKey];
      }
    });
  });

  // Add new powerful public endpoints
  data.endpoints.push({
    name: "Public Utilities & Tools",
    items: [
      {
        "Temp Mail Generate": {
          "desc": "Generate a random temporary email address.",
          "path": "https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=1"
        }
      },
      {
        "Temp Mail Check": {
          "desc": "Check messages in a temp mailbox. Requires login and domain.",
          "path": "https://www.1secmail.com/api/v1/?action=getMessages&login=demo&domain=1secmail.com"
        }
      },
      {
        "Random User Generator": {
          "desc": "Generate random user data for testing.",
          "path": "https://randomuser.me/api/"
        }
      },
      {
        "IP Geolocation": {
          "desc": "Get geolocation data for the current IP.",
          "path": "https://ipapi.co/json/"
        }
      },
      {
        "Random Joke": {
          "desc": "Get a random programming or general joke.",
          "path": "https://official-joke-api.appspot.com/random_joke"
        }
      },
      {
        "Cat Facts": {
          "desc": "Get a random fact about cats.",
          "path": "https://catfact.ninja/fact"
        }
      },
      {
        "Dog Images": {
          "desc": "Get a random dog image.",
          "path": "https://dog.ceo/api/breeds/image/random"
        }
      },
      {
        "Nationalize API": {
          "desc": "Predict the nationality of a name.",
          "path": "https://api.nationalize.io/?name=michael"
        }
      },
      {
        "Agify API": {
          "desc": "Predict the age of a name.",
          "path": "https://api.agify.io/?name=michael"
        }
      },
      {
        "Genderize API": {
          "desc": "Predict the gender of a name.",
          "path": "https://api.genderize.io/?name=luc"
        }
      }
    ]
  });
  
  // Recalculate total endpoints
  let total = 0;
  data.endpoints.forEach(c => total += c.items.length);
  data.totalfitur = total;
}

fs.writeFileSync('src/data/endpoints.json', JSON.stringify(data, null, 2));
console.log('Endpoints cleaned and updated!');
