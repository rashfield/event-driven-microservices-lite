const express = require("express");
const {
  createSubscriber,
  createPublisher,
  subscribe,
  publish,
  buildEvent,
} = require("./shared/eventBus");
const { processPayment } = require("./paymentHandler");

const { log } = require("./shared/logger");

const app = express();
const PORT = 3002;

app.get("/health", (req, res) => {
  res.json({
    service: "payment-service",
    status: "ok"
  });
});

app.listen(PORT, () => {
  log("payment-service", "info", `Payment service running on port ${PORT}`);
});

const subscriber = createSubscriber();
const publisher = createPublisher();
const publishFn = (event) => publish(publisher, event);

(async () => {
  await subscriber.connect();
  await publisher.connect();

  await subscribe(subscriber, async (event) => {
    if (event.type === "order.created") {
      await processPayment(event.payload.orderId, publishFn, buildEvent);
    };
  });
})();
