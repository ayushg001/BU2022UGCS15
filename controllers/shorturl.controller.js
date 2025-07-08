const { v4: uuidv4 } = require("uuid");
const log = require("../logger");

const urlDatabase = new Map(); // In-memory storage

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function generateShortcode() {
  return uuidv4().slice(0, 6); // random 6-char code
}

exports.createShortUrl = (req, res) => {
  const { url, validity = 30, shortcode } = req.body;

  // Basic validations
  if (!url || !isValidUrl(url)) {
    log("backend", "error", "controller", "Invalid URL provided");
    return res.status(400).json({ error: "Invalid URL" });
  }

  let finalShortcode = shortcode || generateShortcode();

  // Ensure uniqueness
  while (urlDatabase.has(finalShortcode)) {
    finalShortcode = generateShortcode();
  }

  const createdAt = new Date();
  const expiresAt = new Date(createdAt.getTime() + validity * 60000); // validity in ms

  const shortUrlData = {
    originalUrl: url,
    createdAt: createdAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
    clickData: [],
  };

  urlDatabase.set(finalShortcode, shortUrlData);

  log("backend", "debug", "service", `Short URL created for ${url} -> ${finalShortcode}`);

  return res.status(201).json({
    shortLink: `http://localhost:${process.env.PORT || 3000}/shorturls/${finalShortcode}`,
    expiry: expiresAt.toISOString(),
  });
};

// Export urlDatabase to use in GET handler later
exports.urlDatabase = urlDatabase;
