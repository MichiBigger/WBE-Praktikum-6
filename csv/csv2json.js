// csv2json.js (asynchrone Version mit Callbacks)
const fs = require("fs");

const [,, inputFile, outputFile] = process.argv;

if (!inputFile || !outputFile) {
  console.error("Usage: node csv2json.js <input.csv> <output.json>");
  process.exit(1);
}

const start = Date.now();

// --- Datei-Infos ---
fs.stat(inputFile, (err, stats) => {
  if (err) throw err;

  console.log("Dateigröße:", stats.size, "Bytes");
  console.log("Letzte Änderung:", stats.mtime.toLocaleString());

  // --- Datei asynchron lesen ---
  fs.readFile(inputFile, "utf8", (err, csv) => {
    if (err) throw err;

    const readTime = Date.now() - start;
    console.log("Benötigte Zeit zum Lesen:", readTime, "ms");

    const lines = csv.trim().split("\n");
    const headers = lines[0].split(",");
    const records = lines.slice(1).map(line => {
      const values = line.split(",");
      return Object.fromEntries(headers.map((h, i) => [h, values[i]]));
    });

    console.log("Anzahl Datensätze:", records.length);

    // --- JSON-Datei asynchron schreiben ---
    fs.writeFile(outputFile, JSON.stringify(records, null, 2), err => {
      if (err) throw err;
      console.log(`✅ JSON-Datei '${outputFile}' erfolgreich erstellt.`);
    });
  });
});
