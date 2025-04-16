import Select from './Select';
import { productsStore, useProductsStore, useCartStore } from '../stores';
import { addEvent } from '../lib/event';
import type { Product } from '../types/product';

export default function ProductSelect() {
  const fragment = document.createDocumentFragment();

  const addToCartButton = document.createElement('button');

  addToCartButton.id = 'add-to-cart';
  addToCartButton.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  addToCartButton.textContent = '추가';

  fragment.appendChild(addToCartButton);

  // 장바구니 상품 추가 버튼 클릭 시 실행되는 핸들러 함수입니다.
  const handleClick = () => {
    const { products, updateProducts } = useProductsStore();
    const { items, increaseCartItem } = useCartStore();

    // 옵션에서 선택한 상품의 id
    const selectedProductId = (
      document.getElementById('product-select') as HTMLSelectElement
    )?.value;
    const selectedProduct = products.find(
      (product) => product.id === selectedProductId,
    );
    const itemInCart = items.find((item) => item.id === selectedProductId);

    if (!selectedProduct) {
      alert('상품이 잘못 선택 되었습니다.');
      return;
    }

    // 장바구니에 상품이 이미 등록되어 있지만 재고가 부족하다면 알림창을 띄웁니다.
    if (itemInCart && itemInCart.quantity + 1 > selectedProduct.quantity) {
      alert('재고가 부족합니다.');
    } else {
      // 재고가 넉넉하다면 장바구니에 상품을 추가합니다.
      increaseCartItem({
        id: selectedProduct.id,
        name: selectedProduct.name,
        price: selectedProduct.price,
      });
      updateProducts(selectedProduct.id, {
        quantity: selectedProduct.quantity - 1,
      });
    }

    // TODO: productStore에 추가
    // lastSelectedProductId = selectedProductId;
  };

  addEvent(addToCartButton, 'click', handleClick);

  const render = () => {
    const { products } = useProductsStore();

    const options = products.map((product: Product) => ({
      id: `product-select-option-${product.id}`,
      value: product.id,
      content: product.name,
    }));

    fragment.prepend(
      Select({
        id: 'product-select',
        className: 'border rounded p-2 mr-2',
        options,
      }),
    );
  };

  productsStore.subscribe(render);
  render();

  return fragment;
}
