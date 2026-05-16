const { handleEvent } = require("../orderHandler");

test("marks order as paid", () => {
  const orders = [{ id: "1", status: "pending" }];

  handleEvent({
    type: "payment.completed",
    payload: { orderId: "1" }
  }, orders);

  expect(orders[0].status).toBe("paid");
});

test("marks order as failed", () => {
  const orders = [{ id: "1", status: "pending" }];

  handleEvent({
    type: "payment.failed",
    payload: { orderId: "1" }
  }, orders);

  expect(orders[0].status).toBe("failed");
});

test("ignores unknown order", () => {
  const orders = [];

  handleEvent({
    type: "payment.completed",
    payload: { orderId: "999" }
  }, orders);

  expect(orders.length).toBe(0);
});