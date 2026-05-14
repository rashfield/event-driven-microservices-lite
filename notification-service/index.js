const express = require("express");
const app = express();

const PORT = 3003;

app.get("/health", (req, res) => {
  res.json({
    service: "notification-service",
    status: "ok"
  });
});

app.listen(PORT, () => {
  console.log(`Notification service running on port ${PORT}`);
});