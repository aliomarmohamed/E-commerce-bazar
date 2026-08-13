const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create a Stripe Checkout Session (kept for compatibility)
exports.createCheckoutSession = async (req, res, next) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'egp',
                        product_data: { name: 'Bazar Product Order' },
                        unit_amount: 5000,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/success`,
            cancel_url: `${process.env.FRONTEND_URL}/cancel`,
        });
        res.status(200).json({ url: session.url });
    } catch (error) {
        next(error);
    }
};

// New: Create a Payment Intent for Stripe (used by frontend `create-payment-intent`)
exports.createPaymentIntent = async (req, res) => {
    try {
        const { amount, currency = 'usd' } = req.body;
        if (!amount || isNaN(amount)) {
            return res.status(400).json({ error: 'Invalid amount' });
        }
        // Stripe expects amount in the smallest currency unit (cents)
        const amountInCents = Math.round(Number(amount) * 100);
        // If STRIPE_SECRET_KEY is not configured, return a simulated client secret
        if (!process.env.STRIPE_SECRET_KEY) {
            const fakeSecret = `sim_client_secret_${Date.now()}`;
            return res.status(200).json({ clientSecret: fakeSecret, simulated: true });
        }
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: String(currency).toLowerCase(),
            payment_method_types: ['card'],
        });
        res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (err) {
        console.error('Stripe createPaymentIntent error:', err);
        res.status(500).json({ error: 'Stripe error' });
    }
};

// New: Simulate a Fawry charge response (returns a reference number)
exports.createFawryCharge = async (req, res) => {
    try {
        const { amount, userEmail, userMobile, itemId, itemName } = req.body;
        // Basic validation
        if (!amount) return res.status(400).json({ error: 'Amount required' });
        const referenceNumber = `FAW-${Date.now().toString(36)}`;
        // In a real integration you'd call Fawry APIs here.
        res.status(200).json({ referenceNumber });
    } catch (err) {
        console.error('Fawry simulation error:', err);
        res.status(500).json({ error: 'Fawry error' });
    }
};

// Webhook handler (kept for compatibility)
exports.handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    if (event.type === 'checkout.session.completed') {
        console.log('💰 Payment verified via webhook!');
    }
    res.status(200).json({ received: true });
};
