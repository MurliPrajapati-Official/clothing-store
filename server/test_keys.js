
async function test() {
  try {
    const url = 'https://uniform-trends-backend.murliprajapati228.workers.dev/api/products';
    console.log('Fetching products from:', url);
    const res = await fetch(url);
    console.log('Status:', res.status);
    console.log('Headers:', Object.fromEntries(res.headers.entries()));
    const text = await res.text();
    console.log('Body length:', text.length);
    console.log('Body start:', text.substring(0, 500));
  } catch (e) {
    console.error('Fetch failed:', e);
  }
}
test();
