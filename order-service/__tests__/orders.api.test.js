const request = require("supertest");
const { createApp } = require("../app");

describe("Orders API", () => {
  test("POST /orders creates order", async () => {
    const orders = [];

    const publishFn = jest.fn(); // mock
    const buildEvent = (type, payload) => ({ type, payload });

    const app = createApp({ orders, publishFn, buildEvent });

    const res = await request(app)
      .post("/orders")
      .send({ amount: 50 });

    expect(res.statusCode).toBe(200);
    expect(res.body.order.amount).toBe(50);
    expect(res.body.order.status).toBe("pending");

    // ensure stored
    expect(orders.length).toBe(1);

    // ensure event published
    expect(publishFn).toHaveBeenCalled();
  });

  test("GET /orders/:id returns order", async () => {
    const orders = [{ id: "1", amount: 50, status: "pending" }];

    const app = createApp({
      orders,
      publishFn: jest.fn(),
      buildEvent: () => {}
    });

    const res = await request(app).get("/orders/1");

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe("1");
  });

  test("POST then GET flow", async () => {
    const orders = [];

    const app = createApp({
      orders,
      publishFn: jest.fn(),
      buildEvent: (t, p) => ({ type: t, payload: p })
    });

    const createRes = await request(app)
      .post("/orders")
      .send({ amount: 75 });

    const id = createRes.body.order.id;

    const getRes = await request(app).get(`/orders/${id}`);

    expect(getRes.body.status).toBe("pending");
  });
});