// Load quotes from localStorage
let quotes = JSON.parse(localStorage.getItem("quotes")) || [];

// Function to save quotes to localStorage
function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Add Quote
document.getElementById("add-quote-btn").addEventListener("click", () => {
    const text = document.getElementById("quote-text").value.trim();
    const category = document.getElementById("quote-category").value.trim();

    if (text && category) {
        quotes.push({ text, category });
        saveQuotes();
        document.getElementById("quote-text").value = "";
        document.getElementById("quote-category").value = "";
        alert("Quote added successfully!");
    } else {
        alert("Please fill out both fields.");
    }
});

// Export Quotes
document.getElementById("export-quotes-btn").addEventListener("click", () => {
    const jsonData = JSON.stringify(quotes, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

// Show random quote
document.getElementById("new-quote-btn").addEventListener("click", () => {
    if (quotes.length > 0) {
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        document.getElementById("quote-display").textContent =
            `"${randomQuote.text}" — ${randomQuote.category}`;
    } else {
        document.getElementById("quote-display").textContent = "No quotes available.";
    }
});
