let quotes = [
  { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
  { text: "Life is what happens when you’re busy making other plans.", category: "Life" }
];

// Show random quote
function showRandomQuote() {
  const display = document.getElementById("quoteDisplay");
  const randomIndex = Math.floor(Math.random() * quotes.length);
  display.innerText = `"${quotes[randomIndex].text}" - ${quotes[randomIndex].category}`;
}

document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Add new quote
function addQuote() {
  const text = document.getElementById("newQuoteText").value;
  const category = document.getElementById("newQuoteCategory").value;

  if (text && category) {
    quotes.push({ text, category });
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    alert("Quote added!");
  } else {
    alert("Please enter both text and category");
  }
}

// Export quotes as JSON file
document.getElementById("exportQuotes").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

// Import quotes from JSON file
document.getElementById("importFile").addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      quotes = quotes.concat(importedQuotes);
      alert("Quotes imported successfully!");
    } catch {
      alert("Invalid JSON file.");
    }
  };

  reader.readAsText(file);
});
