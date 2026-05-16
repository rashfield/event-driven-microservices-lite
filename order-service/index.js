const {
  createPublisher,
  publish,
  createSubscriber,
  subscribe,
  buildEvent,
} = require("./shared/eventBus");

const { createApp } = require("./app");
const { handleEvent } = require("./orderHandler");

const publisher = createPublisher();
const subscriber = createSubscriber();
const publishFn = (event) => publish(publisher, event);

const PORT = 3001;
const orders = [];

const app = createApp({ orders, publishFn, buildEvent });

app.listen(PORT, () => {
  console.log(`Order service running on port ${PORT}`);
});


(async () => {
  await publisher.connect();
  await subscriber.connect();

  await subscribe(subscriber, async (event) => {
    handleEvent(event, orders);
  });
})();
