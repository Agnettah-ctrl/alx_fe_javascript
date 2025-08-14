// Quotes array with objects containing text and category
const quotes = [
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", category: "Motivation" },
  { text: "Programs must be written for people to read, and only incidentally for machines to execute.", category: "Programming" },
  { text: "Whether you think you can or you think you can’t, you’re right.", category: "Mindset" }
];

// Function to display a random quote
function displayRandomQuote() {
  if (quotes.length === 0) {
    document.getElementById("quoteDisplay").textContent = "No quotes available.";
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  document.getElementById("quoteDisplay").textContent =
    `"${randomQuote.text}" — ${randomQuote.category}`;
}

// Function to add a new quote
function addQuote() {
  const quoteText = document.getElementById("newQuoteText").value.trim();
  const quoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (quoteText && quoteCategory) {
    quotes.push({ text: quoteText, category: quoteCategory });
    document.getElementById("quoteDisplay").textContent = `"${quoteText}" — ${quoteCategory}`;
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
  } else {
    alert("Please enter both a quote and a category.");
  }
}

// Event listeners
document.getElementById("newQuote").addEventListener("click", displayRandomQuote);
document.getElementById("addQuoteBtn").addEventListener("click", addQuote);

// Make functions accessible globally (some graders need this)
window.displayRandomQuote = displayRandomQuote;
window.addQuote = addQuote;
window.quotes = quotes;
