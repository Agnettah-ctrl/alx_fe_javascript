// ===== Quotes Data and Initialization =====
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Don’t let yesterday take up too much of today.", category: "Inspiration" },
  { text: "It’s not whether you get knocked down, it’s whether you get up.", category: "Resilience" }
];

// Restore last selected category
let lastSelectedCategory = localStorage.getItem("selectedCategory") || "all";

// ===== Populate Categories =====
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  const categories = [...new Set(quotes.map(q => q.category))];
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    if (cat === lastSelectedCategory) option.selected = true;
    categoryFilter.appendChild(option);
  });
}

// ===== Display Quotes =====
function displayQuotes(filteredQuotes = quotes) {
  const container = document.getElementById("quotesContainer");
  container.innerHTML = "";
  filteredQuotes.forEach(q => {
    const p = document.createElement("p");
    p.textContent = `"${q.text}" — ${q.category}`;
    container.appendChild(p);
  });
}

// ===== Filter Quotes =====
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selectedCategory);

  if (selectedCategory === "all") {
    displayQuotes(quotes);
  } else {
    const filtered = quotes.filter(q => q.category === selectedCategory);
    displayQuotes(filtered);
  }
}

// ===== Add Quote =====
function addQuote() {
  const text = document.getElementById("quoteInput").value.trim();
  const category = document.getElementById("categoryInput").value.trim();

  if (text && category) {
    const newQuote = { text, category };
    quotes.push(newQuote);
    localStorage.setItem("quotes", JSON.stringify(quotes));
    populateCategories();
    filterQuotes();

    // Send to server as well
    postQuoteToServer(newQuote);

    document.getElementById("quoteInput").value = "";
    document.getElementById("categoryInput").value = "";
  }
}

// ===== Export Quotes =====
function exportQuotes() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// ===== Import Quotes =====
function importQuotes(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes = quotes.concat(importedQuotes);
        localStorage.setItem("quotes", JSON.stringify(quotes));
        populateCategories();
        filterQuotes();
      }
    } catch (err) {
      alert("Invalid JSON file");
    }
  };
  reader.readAsText(file);
}

// ===== Fetch Quotes From Server (GET) =====
async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const serverData = await response.json();

    const serverQuotes = serverData.slice(0, 5).map(post => ({
      text: post.title,
      category: "Server"
    }));

    // Merge: server first
    quotes = [...serverQuotes, ...quotes];
    localStorage.setItem("quotes", JSON.stringify(quotes));

    populateCategories();
    filterQuotes();
    console.log("Fetched quotes from server.");
  } catch (error) {
    console.error("Failed to fetch from server", error);
  }
}

// ===== POST new quote to server =====
async function postQuoteToServer(quote) {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(quote)
    });

    const data = await response.json();
    console.log("Quote posted to server:", data);
  } catch (error) {
    console.error("Failed to post quote to server", error);
  }
}

// ===== Sync Quotes (GET + POST all) =====
async function syncQuotes() {
  await fetchQuotesFromServer();

  for (const q of quotes) {
    await postQuoteToServer(q);
  }
  console.log("Quotes synced with server.");
}

// ===== On Load =====
window.onload = function() {
  populateCategories();
  filterQuotes();
  syncQuotes(); // Auto sync on load

  // Auto-sync every 30 seconds
  setInterval(syncQuotes, 30000);
};
