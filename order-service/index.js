const express = require("express");
const {
  createPublisher,
  publish,
  createSubscriber,
  subscribe,
  buildEvent,
} = require("./shared/eventBus");
const crypto = require("crypto");
const { handleEvent } = require("./orderHandler");

const app = express();
app.use(express.json());

const PORT = 3001;
const orders = [];

app.get("/health", (req, res) => {
  res.json({
    service: "order-service",
    status: "ok"
  });
});

app.listen(PORT, () => {
  console.log(`Order service running on port ${PORT}`);
});

const publisher = createPublisher();
const subscriber = createSubscriber();
(async () => {
  await publisher.connect();
  await subscriber.connect();

  await subscribe(subscriber, async (event) => {
    handleEvent(event, orders);
  });
})();

app.post("/orders", async (req, res) => {
  const order = {
    id: crypto.randomUUID(),
    amount: req.body.amount || 100,
    timestamp: new Date().toISOString(),
    status: "pending",
  };
  orders.push(order);

  const event = buildEvent("order.created", order);

  await publish(publisher, event);

  res.json({ order });
});

app.get("/orders/:id", (req, res) => {
  const order = orders.find(o => o.id === req.params.id);

  if (!order) {
    return res.status(404).json({ error: "Not found" });
  }

  res.json(order);
});
