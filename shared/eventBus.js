const { createClient } = require("redis");
const crypto = require("crypto");

const CHANNEL = "events";
const REDIS_URL = "redis://redis:6379";

// Create separate clients for pub/sub (important)
function createPublisher() {
  const client = createClient({
    url: REDIS_URL,
  });

  client.on("error", (err) => {
    console.error("Redis Publisher Error:", err);
  });

  return client;
}

function createSubscriber() {
  const client = createClient({
    url: REDIS_URL,
  });

  client.on("error", (err) => {
    console.error("Redis Subscriber Error:", err);
  });

  return client;
}

// Standard event format
function buildEvent(type, payload) {
  return {
    id: crypto.randomUUID(),
    type,
    timestamp: new Date().toISOString(),
    payload,
  };
}

// Publish event
async function publish(client, event) {
  await client.publish(CHANNEL, JSON.stringify(event));
  console.log(`[EVENT PUBLISHED] ${event.type}`);
}

// Subscribe to events
async function subscribe(client, handler) {
  await client.subscribe(CHANNEL, (message) => {
    try {
      const event = JSON.parse(message);
      handler(event);
    } catch (err) {
      console.error("Failed to parse event:", err);
    }
  });

  console.log("[SUBSCRIBED] Listening for events...");
}

module.exports = {
  createPublisher,
  createSubscriber,
  publish,
  subscribe,
  buildEvent,
};
