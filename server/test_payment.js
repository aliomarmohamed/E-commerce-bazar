const paymentController = require('./src/controllers/payment.controller');

function mockRes() {
  let statusCode = 200;
  return {
    status(code) {
      statusCode = code;
      return this;
    },
    json(payload) {
      console.log('RESPONSE', statusCode, JSON.stringify(payload, null, 2));
    },
    send(payload) {
      console.log('SEND', statusCode, payload);
    },
  };
}

async function runTests() {
  console.log('Testing createPaymentIntent (amount=12.34)');
  await paymentController.createPaymentIntent(
    { body: { amount: 12.34, currency: 'usd' } },
    mockRes()
  );

  console.log('\nTesting createFawryCharge (amount=15)');
  await paymentController.createFawryCharge(
    { body: { amount: 15, userEmail: 'test@ex.com', userMobile: '01000000000' } },
    mockRes()
  );
}

runTests().catch((e) => console.error('Test script error:', e));
