const axios = require("axios");

jest.setTimeout(15000); // increase timeout for async processing and service responses

describe("Order flow E2E", () => {
  test("creates order and updates status", async () => {
    // create order
    const createRes = await axios.post(
      "http://localhost:3001/orders",
      { amount: 50 }
    );
    expect(createRes.status).toBe(200);

    let order = createRes.data.order;
    const orderId = order.orderId;

    // wait for order status to change from pending
    while (order.status == "pending") {
        
        const res = await getOrder(orderId);
        order = res.data;

        // wait for async event processing
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    // fetch updated order
    const getRes = await getOrder(orderId);
    expect(getRes.status).toBe(200);

    expect(["paid", "failed"]).toContain(
      getRes.data.status
    );
  });
});

function getOrder(orderId) {
    return axios.get(
        `http://localhost:3001/orders/${orderId}`
    );
}
