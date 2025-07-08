// logger.js

const axios = require("axios");
require("dotenv").config(); 

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
//  Base URL for the logging service

const BASE_URL = process.env.LOGGING_URL;

/**
 * Sends logs to the test server.
 
 @param {string} stack - "backend" or "frontend"
    @param {string} level - "debug", "info", "warn", "error", "fatal"
   @param {string} packageName - Like "controller", "db", "handler", etc.
       @param {string} message - Descriptive log message
 */
function log(stack, level, packageName, message) {
  // Allowed values validation (required)
  const allowedStacks = ["backend", "frontend"];
  const allowedLevels = ["debug", "info", "warn", "error", "fatal"];
  const allowedPackages = [
    "cache", "controller", "cron_job", "db", "domain",
    "handler", "repository", "route", "service"
  ];

  if (
    !allowedStacks.includes(stack) ||
    !allowedLevels.includes(level) ||
    !allowedPackages.includes(packageName)
  ) {
    console.error("Invalid parameters for logging function.");
    return;
  }

  //  Payload to send
  const payload = {
    stack,
    level,
    package: packageName,
    message,
  };

  //  POST request to log endpoint
  axios
    .post(BASE_URL, payload, {
      headers: {
        Authorization: ACCESS_TOKEN,
        "Content-Type": "application/json",
      },
    })
 .then(() => {
      console.log(`[LOGGED]: [${level}] in ${packageName}`);
    })
 .catch((err) => {
      console.error("Log failed:", err.response?.data || err.message);
    });
}

module.exports = log;
