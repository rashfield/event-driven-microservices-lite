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

const {
  createSubscriber,
  createPublisher,
  subscribe,
  publish,
  buildEvent,
} = require("../shared/eventBus");
const crypto = require("crypto");

const subscriber = createSubscriber();
const publisher = createPublisher();

(async () => {
  await subscriber.connect();
  await publisher.connect();

  await subscribe(subscriber, async (event) => {
    if (event.type === "order.created") {
      console.log("[PAYMENT] Processing order:", event.payload.id);

      // simulate delay
      setTimeout(async () => {
        const success = Math.random() > 0.3;

        const newEvent = buildEvent(
          success ? "payment.completed" : "payment.failed",
          {
            orderId: event.payload.id,
          }
        );

        await publish(publisher, newEvent);
      }, 2000);
    }
  });
})();
