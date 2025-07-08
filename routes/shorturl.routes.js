const express = require("express");
const router = express.Router();
const { createShortUrl } = require("../controllers/shorturl.controller");

router.post("/", createShortUrl); // POST /shorturls

module.exports = router;
