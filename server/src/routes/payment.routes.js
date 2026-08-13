const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');

// Frontend expects endpoints named `create-payment-intent` and `create-fawry-charge`.
router.post('/create-payment-intent', paymentController.createPaymentIntent);
router.post('/create-fawry-charge', paymentController.createFawryCharge);

// Legacy/compatibility endpoints
router.post('/checkout', paymentController.createCheckoutSession);
router.post('/webhook', express.raw({ type: 'application/json' }), paymentController.handleStripeWebhook);

module.exports = router;
