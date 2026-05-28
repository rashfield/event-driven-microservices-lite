const axios = require("axios");

jest.setTimeout(15000);

describe("Order flow E2E", () => {
  test("creates order and updates status", async () => {
    // create order
    const createRes = await axios.post(
      "http://localhost:3001/orders",
      { amount: 50 }
    );

    expect(createRes.status).toBe(200);

    const orderId = createRes.data.order.orderId;

    // wait for async event processing
    await new Promise(resolve => setTimeout(resolve, 7000));

    // fetch updated order
    const getRes = await axios.get(
      `http://localhost:3001/orders/${orderId}`
    );

    expect(getRes.status).toBe(200);

    expect(["paid", "failed"]).toContain(
      getRes.data.status
    );
  });
});
