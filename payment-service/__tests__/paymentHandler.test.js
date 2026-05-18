const { processPayment } = require("../paymentHandler");

test("publishes completed event", async () => {
  const publish = jest.fn();
  const buildEvent = (type, payload) => ({ type, payload });

  // force success
  jest.spyOn(Math, "random").mockReturnValue(1);

  await processPayment("1", publish, buildEvent);

  expect(publish).toHaveBeenCalledWith({
    type: "payment.completed",
    payload: { orderId: "1" }
  });
}, 3000);

test("retries then fails", async () => {
  const publish = jest.fn();
  const buildEvent = (type, payload) => ({ type, payload });

  // force failure
  jest.spyOn(Math, "random").mockReturnValue(0);

  await processPayment("1", publish, buildEvent);

  expect(publish).toHaveBeenCalledWith({
    type: "payment.failed",
    payload: { orderId: "1" }
  });
}, 3000);