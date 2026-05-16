const { setTimeout } = require("timers/promises");

async function processPayment(orderId, publish, buildEvent, attempt = 1) {
    console.log(`[PAYMENT] Attempt ${attempt} for order ${orderId}`);

    const success = Math.random() > 0.3;

    if (!success && attempt < 2) {
        console.log(`[PAYMENT] Retrying... for order ${orderId}`);
        // wait for 1 second before retrying
        await setTimeout(1000);
        await processPayment(orderId, publish, buildEvent, attempt + 1);
    }

    const newEvent = buildEvent(
        success ? "payment.completed" : "payment.failed",
        { orderId: orderId }
    );

    await publish(newEvent);
}

module.exports = { processPayment };