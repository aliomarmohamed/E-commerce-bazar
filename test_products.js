async function run() {
  try {
    const mod = await import('./src/api/Api.js');
    const res = await mod.productsData();
    if (res && res.data && res.data.length) {
      console.log('Fetched', res.data.length, 'products');
      console.log('First product _id:', res.data[0]._id);
      console.log('First product image:', res.data[0].image);
    } else {
      console.log('No products returned');
    }
  } catch (e) {
    console.error('Error fetching products:', e && e.message ? e.message : e);
  }
}

run();
