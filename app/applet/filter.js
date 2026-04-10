const fs = require("fs");
const data = JSON.parse(fs.readFileSync("src/data/endpoints.json", "utf8"));
const originalLength = data.endpoints.length;
const filtered = data.endpoints.filter(cat => {
  if (cat.items && cat.items.length > 0) {
    const firstItem = Object.values(cat.items[0])[0];
    if (firstItem.path && firstItem.path.startsWith("http")) {
      return false;
    }
  }
  return true;
});
data.endpoints = filtered;
fs.writeFileSync("src/data/endpoints.json", JSON.stringify(data, null, 2));
console.log("Filtered out from " + originalLength + " to " + filtered.length + " categories");
