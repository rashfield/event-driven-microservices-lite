const express = require("express");
const app = express();

const PORT = 3001;

app.get("/health", (req, res) => {
  res.json({
    service: "order-service",
    status: "ok"
  });
});

app.listen(PORT, () => {
  console.log(`Order service running on port ${PORT}`);
});