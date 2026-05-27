const express = require("express");
const app = express();
const { log } = require("./shared/logger");

const PORT = 3003;

app.get("/health", (req, res) => {
  res.json({
    service: "notification-service",
    status: "ok"
  });
});

app.listen(PORT, () => {
  log("notification-service", "info", `Notification service running on port ${PORT}`);
});

const {
  createSubscriber,
  subscribe,
} = require("./shared/eventBus");

const subscriber = createSubscriber();

(async () => {
  await subscriber.connect();

  await subscribe(subscriber, async (event) => {
    switch (event.type) {
      case "order.created":
        log("notification-service", "info", "Order received", { orderId: event.payload.orderId });
        break;

      case "payment.completed":
        log("notification-service", "info", "Payment successful", { orderId: event.payload.orderId });
        break;

      case "payment.failed":
        log("notification-service", "error", "Payment failed", { orderId: event.payload.orderId });
        break;
    }
  });
})();
