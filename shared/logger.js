function log(service, level, message, extra = {}) {
  console.log(JSON.stringify({
    service,
    level,
    message,
    timestamp: new Date().toISOString(),
    ...extra
  }));
}

module.exports = { log };
