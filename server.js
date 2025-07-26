const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());

const DATA_FILE = './data.json';

// Load data from file if it exists
let stockData = {};
if (fs.existsSync(DATA_FILE)) {
    stockData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

// POST /updateStock — Receive stock updates
app.post('/updateStock', (req, res) => {
    const { item, price, timestamp } = req.body;

    if (!item || !price) {
        return res.status(400).json({ error: "Missing item or price" });
    }

    stockData[item] = {
        price: price,
        lastUpdated: timestamp || Date.now()
    };

    // Save to file
    fs.writeFileSync(DATA_FILE, JSON.stringify(stockData, null, 2));

    console.log(`[✅] Received stock update: ${item} = ${price}`);
    res.sendStatus(200);
});

// GET /getStock — Return full stock list
app.get('/getStock', (req, res) => {
    res.json(stockData);
});

app.listen(PORT, () => {
    console.log(`🟢 API Server running on http://localhost:${PORT}`);
});
