import CartItems from './CartItems';
import ProductSelect from './ProductSelect';
import CartTotal from './CartTotal';

export default function Cart() {
  const wrapper = document.createElement('div');
  wrapper.id = 'wrapper';
  wrapper.className =
    'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';

  const render = () => {
    wrapper.innerHTML = /* HTML */ `
      <h1 class="text-2xl font-bold mb-4">장바구니</h1>
    `;
    wrapper.appendChild(CartItems());
    wrapper.appendChild(CartTotal());
    wrapper.appendChild(ProductSelect());
  };

  render();

  return wrapper;
}
