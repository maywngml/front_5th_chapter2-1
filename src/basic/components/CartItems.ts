import { cartStore, useCartStore } from '../stores';

export default function CartItems() {
  const cartItems = document.createElement('div');
  cartItems.id = 'cart-items';

  const render = () => {
    const { items } = useCartStore();

    cartItems.innerHTML = /* HTML */ `
      ${items
        .map(
          (
            item,
          ) => `<div id=${item.id} className="flex justify-between items-center mb-2">
        <span> ${item.name} - ${item.price}원 x 1</span><div><button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${item.id}" data-change="-1">-</button><button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${item.id}" data-change="1">+</button><button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${item.id}">삭제</button></div>
        </div>`,
        )
        .join('')}
    `;
  };

  cartStore.subscribe(render);
  render();

  return cartItems;
}
