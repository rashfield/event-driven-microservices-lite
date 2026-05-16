const { handleEvent } = require("../orderHandler");

test("order lifecycle: pending → paid", () => {
  const orders = [{ id: "1", status: "pending" }];

  // simulate payment success event
  handleEvent({
    type: "payment.completed",
    payload: { orderId: "1" }
  }, orders);

  expect(orders[0].status).toBe("paid");
});

test("order lifecycle: pending → failed", () => {
  const orders = [{ id: "1", status: "pending" }];

  handleEvent({
    type: "payment.failed",
    payload: { orderId: "1" }
  }, orders);

  expect(orders[0].status).toBe("failed");
});