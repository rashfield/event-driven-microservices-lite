const { createClient } = require("redis");
const crypto = require("crypto");
const { log } = require("./logger");

const CHANNEL = "events";
const REDIS_URL = "redis://redis:6379";

// Create separate clients for pub/sub (important)
function createPublisher() {
  const client = createClient({
    url: REDIS_URL,
  });

  client.on("error", (err) => {
    log("event-bus", "error", "Redis Publisher Error:", { error: err });
  });

  return client;
}

function createSubscriber() {
  const client = createClient({
    url: REDIS_URL,
  });

  client.on("error", (err) => {
    log("event-bus", "error", "Redis Subscriber Error:", { error: err });
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
  log("event-bus", "info", `Event published: ${event.type}`, { eventId: event.id });
}

// Subscribe to events
async function subscribe(client, handler) {
  await client.subscribe(CHANNEL, (message) => {
    try {
      const event = JSON.parse(message);
      handler(event);
    } catch (err) {
      log("event-bus", "error", "Failed to parse event:", { error: err });
    }
  });

  log("event-bus", "info", "[SUBSCRIBED] Listening for events...");
}

module.exports = {
  createPublisher,
  createSubscriber,
  publish,
  subscribe,
  buildEvent,
};
