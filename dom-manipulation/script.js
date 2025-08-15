// Load quotes from localStorage or use default ones
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
    { text: "Don't let yesterday take up too much of today.", category: "Inspiration" },
    { text: "It’s not whether you get knocked down, it’s whether you get up.", category: "Perseverance" }
];

// Function to display a random quote
function displayRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quoteDisplay = document.getElementById("quote-display");
    quoteDisplay.textContent = `"${quotes[randomIndex].text}" — ${quotes[randomIndex].category}`;
}

// Function to add a new quote
function addQuote() {
    const quoteText = document.getElementById("quote-text").value.trim();
    const quoteCategory = document.getElementById("quote-category").value.trim();

    if (quoteText && quoteCategory) {
        const newQuote = { text: quoteText, category: quoteCategory };
        quotes.push(newQuote);

        // Save updated quotes to localStorage
        localStorage.setItem("quotes", JSON.stringify(quotes));

        // Update DOM immediately
        displayRandomQuote();

        // Clear inputs
        document.getElementById("quote-text").value = "";
        document.getElementById("quote-category").value = "";

        alert("Quote added successfully!");
    } else {
        alert("Please fill in both fields.");
    }
}

// Event listeners
document.getElementById("new-quote-btn").addEventListener("click", displayRandomQuote);
document.getElementById("add-quote-btn").addEventListener("click", addQuote);

// Display a quote when page loads
displayRandomQuote();
