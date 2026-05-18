function handleEvent(event, orders) {
    if (event.type === "payment.completed") {
        const order = orders.find(o => o.orderId === event.payload.orderId);
        if (order) {
        order.status = "paid";
        console.log("[ORDER] Marked as PAID:", order.orderId);
        }
    }

    if (event.type === "payment.failed") {
        const order = orders.find(o => o.orderId === event.payload.orderId);
        if (order) {
        order.status = "failed";
        console.log("[ORDER] Marked as FAILED:", order.orderId);
        }
    }
}

module.exports = { handleEvent };