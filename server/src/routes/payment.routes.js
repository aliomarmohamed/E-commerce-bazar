const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');

router.post('/checkout', paymentController.createCheckoutSession);
router.post('/webhook', express.raw({ type: 'application/json' }), paymentController.handleStripeWebhook);

module.exports = router;
