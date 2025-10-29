// server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

let inventory = []; // In-memory DB

// --- Get all items ---
app.get("/items", (req, res) => {
    res.json(inventory);
});

// --- Add item ---
app.post("/items", (req, res) => {
    const item = req.body;
    if (inventory.find((i) => i.sku === item.sku)) {
        return res.status(400).json({ error: "SKU already exists" });
    }
    inventory.push(item);
    res.json({ message: "Item added successfully", item });
});

// --- Update item ---
app.put("/items/:sku", (req, res) => {
    const { sku } = req.params;
    const index = inventory.findIndex((i) => i.sku === sku);
    if (index === -1) return res.status(404).json({ error: "Item not found" });

    inventory[index] = {...inventory[index], ...req.body };
    res.json({ message: "Item updated", item: inventory[index] });
});

// --- Delete item ---
app.delete("/items/:sku", (req, res) => {
    const { sku } = req.params;
    const index = inventory.findIndex((i) => i.sku === sku);
    if (index === -1) return res.status(404).json({ error: "Item not found" });

    inventory.splice(index, 1);
    res.json({ message: "Item deleted" });
});

// Start Server
const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
