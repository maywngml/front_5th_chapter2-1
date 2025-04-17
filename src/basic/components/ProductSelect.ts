import Select from './Select';
import { productsStore, useProductsStore, useCartStore } from '../stores';
import { addEvent } from '../lib/event';
import type { Item } from '../stores';
import type { Product } from '../types/product';

export default function ProductSelect() {
  const fragment = document.createDocumentFragment();

  const addToCartButton = document.createElement('button');

  addToCartButton.id = 'add-to-cart';
  addToCartButton.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  addToCartButton.textContent = '추가';

  fragment.appendChild(addToCartButton);

  // 장바구니에 추가되어 있는 상품의 수량을 증가시키는 함수입니다.
  const increaseProductInCart = (item: Item, product: Product) => {
    const { increaseCartItem } = useCartStore();
    const { updateProducts } = useProductsStore();
    // 장바구니에 입력될 수량이 현재 상품의 재고보다 적을 때는 수량을 추가합니다.
    if (item.quantity + 1 <= product.quantity) {
      increaseCartItem({
        id: product.id,
        name: product.name,
        price: product.price,
      });
      updateProducts(product.id, {
        quantity: product.quantity - 1,
      });
    } else {
      // 수량이 현재 상품 재고보다 크다면 알림창을 표시합니다.
      alert('재고가 부족합니다.');
    }
  };

  // 장바구니 내 상품 수량을 수정하는 함수입니다.
  const addProductInCart = (product: Product) => {
    const { updateProducts } = useProductsStore();
    const { increaseCartItem } = useCartStore();

    increaseCartItem({
      id: product.id,
      name: product.name,
      price: product.price,
    });
    updateProducts(product.id, {
      quantity: product.quantity - 1,
    });
  };

  // 장바구니 상품 추가 버튼 클릭 시 실행되는 핸들러 함수입니다.
  const handleClick = () => {
    const { products, updateLastSelectedProductId } = useProductsStore();
    const { items } = useCartStore();

    // 옵션에서 선택한 상품의 id
    const selectedProductId = (
      document.getElementById('product-select') as HTMLSelectElement
    )?.value;
    const selectedProduct = products.find(
      (product) => product.id === selectedProductId,
    );

    if (!selectedProduct) {
      alert('상품이 잘못 선택 되었습니다.');
      return;
    }

    // 선택된 상품의 재고가 없다면 리턴합니다.
    if (selectedProduct.quantity <= 0) {
      alert('재고가 부족합니다');
      return;
    }

    const itemInCart = items.find((item) => item.id === selectedProductId);

    if (itemInCart) {
      increaseProductInCart(itemInCart, selectedProduct);
    } else {
      addProductInCart(selectedProduct);
    }

    updateLastSelectedProductId(selectedProductId);
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
