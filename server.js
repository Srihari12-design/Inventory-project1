const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database file path
const DB_FILE = path.join(__dirname, "db.json");

// Serve frontend files (index.html, script.js, style.css)
app.use(express.static(__dirname));

// ✅ Serve index.html when visiting http://localhost:3000
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Read DB
function readDB() {
    if (!fs.existsSync(DB_FILE)) return [];
    return JSON.parse(fs.readFileSync(DB_FILE, "utf8") || "[]");
}

// Write DB
function writeDB(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Get all items
app.get("/items", (req, res) => {
    res.json(readDB());
});

// Add item
app.post("/items", (req, res) => {
    const items = readDB();
    const newItem = req.body;

    // prevent duplicate SKU
    if (items.some((i) => i.sku === newItem.sku)) {
        return res.status(400).json({ error: "SKU already exists" });
    }

    items.push(newItem);
    writeDB(items);
    res.json({ message: "Item added successfully", item: newItem });
});

// Update item
app.put("/items/:sku", (req, res) => {
    const { sku } = req.params;
    const updates = req.body;
    const items = readDB();

    const index = items.findIndex((i) => i.sku === sku);
    if (index === -1) return res.status(404).json({ error: "Item not found" });

    items[index] = {...items[index], ...updates };
    writeDB(items);

    res.json({ message: "Item updated successfully", item: items[index] });
});

// Delete item
app.delete("/items/:sku", (req, res) => {
    const { sku } = req.params;
    const items = readDB();

    const filtered = items.filter((i) => i.sku !== sku);
    if (filtered.length === items.length)
        return res.status(404).json({ error: "Item not found" });

    writeDB(filtered);
    res.json({ message: "Item deleted successfully" });
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});