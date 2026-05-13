
async function test() {
  try {
    const res = await fetch('http://localhost:5000/api/orders');
    const orders = await res.json();
    console.log(orders[0]);
  } catch (e) {
    console.error(e);
  }
}
test();
