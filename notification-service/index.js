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

const {
  createSubscriber,
  subscribe,
} = require("../shared/eventBus");

const subscriber = createSubscriber();

(async () => {
  await subscriber.connect();

  await subscribe(subscriber, async (event) => {
    switch (event.type) {
      case "order.created":
        console.log("[NOTIFY] Order received:", event.payload.id);
        break;

      case "payment.completed":
        console.log("[NOTIFY] Payment successful:", event.payload.orderId);
        break;

      case "payment.failed":
        console.log("[NOTIFY] Payment failed:", event.payload.orderId);
        break;
    }
  });
})();
