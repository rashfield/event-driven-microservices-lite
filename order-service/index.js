const express = require("express");
const app = express();
app.use(express.json());

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

const {
  createPublisher,
  publish,
  buildEvent,
} = require("./shared/eventBus");
const crypto = require("crypto");
const { time } = require("console");

const publisher = createPublisher();

(async () => {
  await publisher.connect();
})();

app.post("/orders", async (req, res) => {
  const order = {
    id: crypto.randomUUID(),
    amount: req.body.amount || 100,
    timestamp: new Date().toISOString(),
  };

  const event = buildEvent("order.created", order);

  await publish(publisher, event);

  res.json({ order });
});
