
const express = require("express");
const log = require("./logger");

const app = express();
const shortUrlRoutes = require('./routes/shorturl.routes');

const { urlDatabase } = require('./controllers/shorturl.controller');
app.use(express.json());
app.use('/shorturls', shortUrlRoutes);
// In-memory store for shortened URLs


// GET /shorturls/:shortcode
app.get('/shorturls/:shortcode', (req, res) => {
  const { shortcode } = req.params;
console.log('Current shortcodes in memory:', Array.from(urlDatabase.keys()));
  // Lookup short URL info in memory
  const data = urlDatabase.get(shortcode);
  if (!data) {
    return res.status(404).json({ error: 'Shortcode not found' });
  }

  const stats = {
    url: data.url,
    createdAt: data.createdAt,
    expiry: data.expiry,
    totalClicks: data.clicks.length,
    clicks: data.clicks.map(click => ({
      timestamp: click.timestamp,
      referer: click.referer || 'unknown',
      location: click.location || 'unknown'
    }))
  };

  res.status(200).json(stats);
});


//  Root route log example
app.get("/", (req, res) => {
  log("backend", "info", "route", "Root route accessed");
  res.send("Hello from backend!");
});

// Error handling log
app.post("/user", (req, res) => {
  const { name } = req.body;

  if (!name) {
    log("backend", "error", "controller", "Missing 'name' in POST /user");
    return res.status(400).json({ error: "Name is required" });
  }

  log("backend", "info", "controller", `User ${name} added`);
  res.status(201).json({ message: `Welcome, ${name}!` });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
