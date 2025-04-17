import CartItems from './CartItems';
import ProductSelect from './ProductSelect';
import CartTotal from './CartTotal';
import StockStatus from './StockStatus';
import { useProductsStore } from '../stores';

export default function Cart() {
  const wrapper = document.createElement('div');
  wrapper.id = 'wrapper';
  wrapper.className =
    'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';

  const LUCKY_SALE_DISCOUNT_RATE = 0.8;
  const SUGGESTION_SALE_DISCOUNT_RATE = 0.95;

  // 랜덤하게 선택된 상품에 대해 세일이 진행 중임을 알립니다.
  const notifyLuckySale = () => {
    const { products, updateProduct } = useProductsStore();

    setInterval(() => {
      // 랜덤으로 세일을 진행할 상품을 선택합니다.
      const luckyItem = products[Math.floor(Math.random() * products.length)];

      // 해당 상품의 재고가 남아있다면 상품 가격의 20%를 할인하고 알림창을 띄웁니다.
      if (luckyItem.quantity > 0) {
        alert(`번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
        updateProduct(luckyItem.id, {
          price: Math.round(luckyItem.price * LUCKY_SALE_DISCOUNT_RATE),
        });
      }
    }, 10000);
  };

  // 재고가 남아있는 상품 중 하나를 선택해 추가 할인을 적용합니다.
  const notifyPurchaseSuggestion = () => {
    const { products, lastSelectedProductId, updateProduct } =
      useProductsStore();

    setInterval(() => {
      if (!lastSelectedProductId) return;

      // 재고가 있으며 마지막에 추가된 상품이 아닌 다른 상품을 선택합니다.
      const suggestedProduct = products.find(
        (product) =>
          product.id !== lastSelectedProductId && product.quantity > 0,
      );

      // 위 조건에 부합하는 상품이 있을 경우 해당 상품 가격을 변경하고 알림창을 생성합니다.
      if (suggestedProduct) {
        suggestedProduct.price = Math.round(
          suggestedProduct.price * SUGGESTION_SALE_DISCOUNT_RATE,
        );

        alert(
          `${suggestedProduct.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`,
        );
        updateProduct(suggestedProduct.id, {
          price: Math.round(
            Math.round(suggestedProduct.price * SUGGESTION_SALE_DISCOUNT_RATE),
          ),
        });
      }
    }, 60000);
  };

  const render = () => {
    wrapper.innerHTML = /* HTML */ `
      <h1 class="text-2xl font-bold mb-4">장바구니</h1>
    `;
    wrapper.appendChild(CartItems());
    wrapper.appendChild(CartTotal());
    wrapper.appendChild(ProductSelect());
    wrapper.appendChild(StockStatus());
  };

  render();
  notifyLuckySale();
  notifyPurchaseSuggestion();

  return wrapper;
}
