const express = require("express");
const crypto = require("crypto");

function createApp({ orders, publishFn, buildEvent }) {
  const app = express();
  app.use(express.json());

  app.get("/health", (req, res) => {
    res.json({
      service: "order-service",
      status: "ok"
    });
  });

  app.post("/orders", async (req, res) => {
    const order = {
      id: crypto.randomUUID(),
      amount: req.body.amount || 100,
      timestamp: new Date().toISOString(),
      status: "pending",
    };

    orders.push(order);

    const event = buildEvent("order.created", order);

    if (publishFn) {
      await publishFn(event);
    }

    res.json({ order });
  });

  app.get("/orders/:id", (req, res) => {
    const order = orders.find(o => o.id === req.params.id);

    if (!order) {
      return res.status(404).json({ error: "Not found" });
    }

    res.json(order);
  });

  return app;
}

module.exports = { createApp };