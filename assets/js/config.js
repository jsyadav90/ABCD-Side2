// assets/js/config.js

const BASE_URL =
  window.location.hostname.includes("localhost") ||
  window.location.hostname.includes("127.0.0.1")
    ? "http://localhost:5000"
    : "https://backend-luby.onrender.com";
