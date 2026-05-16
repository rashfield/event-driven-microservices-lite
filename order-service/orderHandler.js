function handleEvent(event, orders) {
    if (event.type === "payment.completed") {
        const order = orders.find(o => o.id === event.payload.orderId);
        if (order) {
        order.status = "paid";
        console.log("[ORDER] Marked as PAID:", order.id);
        }
    }

    if (event.type === "payment.failed") {
        const order = orders.find(o => o.id === event.payload.orderId);
        if (order) {
        order.status = "failed";
        console.log("[ORDER] Marked as FAILED:", order.id);
        }
    }
}

module.exports = { handleEvent };