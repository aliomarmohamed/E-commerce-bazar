const { createStore } = require('redux');
const bazarReducer = require('./src/redux/bazarSlice').default;
const actions = require('./src/redux/bazarSlice');

function run() {
  const store = createStore(bazarReducer);
  console.log('Initial state', store.getState());

  // Add item
  const item = { _id: 'p1', title: 'T', price: 10, quantity: 1 };
  store.dispatch(actions.addToCart(item));
  console.log('After add', store.getState());

  // Increment
  store.dispatch(actions.increamentQuantity({ _id: 'p1' }));
  console.log('After increment', store.getState());

  // Decrement
  store.dispatch(actions.decrementQuantity({ _id: 'p1' }));
  console.log('After decrement', store.getState());

  // Total
  const total = store.getState().productData.reduce((s, it) => s + it.price * it.quantity, 0);
  console.log('Total', total);
}

run();
