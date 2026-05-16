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
} = require("./shared/eventBus");
const crypto = require("crypto");

const subscriber = createSubscriber();
const publisher = createPublisher();

const processPayment = async (event, attempt = 1) => {
        console.log(`[PAYMENT] Attempt ${attempt} for order ${event.payload.id}`);

        const success = Math.random() > 0.3;

        if (!success && attempt < 2) {
          console.log(`[PAYMENT] Retrying... for order ${event.payload.id}`);
          return setTimeout(() => processPayment(event, attempt + 1), 1000);
        }

        const newEvent = buildEvent(
          success ? "payment.completed" : "payment.failed",
          { orderId: event.payload.id }
        );

        await publish(publisher, newEvent);
};

(async () => {
  await subscriber.connect();
  await publisher.connect();

  await subscribe(subscriber, async (event) => {
    if (event.type === "order.created") {
      await processPayment(event);
    };
  });
})();
