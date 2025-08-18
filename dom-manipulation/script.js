// Load quotes from localStorage or default
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
  { text: "Life is what happens when you’re busy making other plans.", category: "Life" }
];

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// ====== CATEGORY FILTERING ======
function populateCategories() {
  const filter = document.getElementById("categoryFilter");
  const categories = [...new Set(quotes.map(q => q.category))]; // unique categories

  // reset options
  filter.innerHTML = `<option value="all">All Categories</option>`;

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    filter.appendChild(option);
  });

  // restore last filter from storage
  const lastFilter = localStorage.getItem("lastFilter");
  if (lastFilter) {
    filter.value = lastFilter;
    filterQuotes();
  }
}

function filterQuotes() {
  const selected = document.getElementById("categoryFilter").value;
  localStorage.setItem("lastFilter", selected);

  let filtered = quotes;
  if (selected !== "all") {
    filtered = quotes.filter(q => q.category === selected);
  }

  const display = document.getElementById("quoteDisplay");
  if (filtered.length > 0) {
    const randomIndex = Math.floor(Math.random() * filtered.length);
    display.innerText = `"${filtered[randomIndex].text}" - ${filtered[randomIndex].category}`;
  } else {
    display.innerText = "No quotes available for this category.";
  }
}

// ====== QUOTE FUNCTIONS ======
function showRandomQuote() {
  filterQuotes(); // ensures filter is respected
}
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

function addQuote() {
  const text = document.getElementById("newQuoteText").value;
  const category = document.getElementById("newQuoteCategory").value;

  if (text && category) {
    quotes.push({ text, category });
    saveQuotes();
    populateCategories();
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    alert("Quote added!");
  } else {
    alert("Please enter both text and category");
  }
}

// ====== EXPORT ======
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

// ====== IMPORT ======
document.getElementById("importFile").addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      quotes = quotes.concat(importedQuotes);
      saveQuotes();
      populateCategories();
      alert("Quotes imported successfully!");
    } catch {
      alert("Invalid JSON file.");
    }
  };
  reader.readAsText(file);
});

// ====== SYNC WITH SERVER (Simulation) ======
async function syncWithServer() {
  const status = document.getElementById("syncStatus");
  status.innerText = "Syncing with server...";

  try {
    // Fetch latest quotes from mock server (simulate conflict)
    const res = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=3");
    const serverData = await res.json();

    // Convert server posts to quotes
    const serverQuotes = serverData.map(post => ({
      text: post.title,
      category: "Server"
    }));

    // Conflict resolution: server wins
    quotes = quotes.concat(serverQuotes);
    saveQuotes();
    populateCategories();

    status.innerText = "Synced successfully (server data merged).";
  } catch (err) {
    status.innerText = "Sync failed: " + err.message;
  }
}

// Run sync every 20s
setInterval(syncWithServer, 20000);

// ====== INIT ======
populateCategories();
filterQuotes(); // show a quote on load
