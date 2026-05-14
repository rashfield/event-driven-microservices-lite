const express = require("express");
const app = express();

const PORT = 3002;

app.get("/health", (req, res) => {
  res.json({
    service: "payment-service",
    status: "ok"
  });
});

app.listen(PORT, () => {
  console.log(`Payment service running on port ${PORT}`);
});