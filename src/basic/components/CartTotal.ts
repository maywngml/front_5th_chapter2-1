import { cartStore, useCartStore } from '../stores/useCartStore';
import { useProductsStore } from '../stores';

export default function CartTotal() {
  const cartTotal = document.createElement('div');
  cartTotal.id = 'cart-total';
  cartTotal.className = 'text-xl font-bold my-4';

  const MAX_SALE_COUNT = 30;
  const MAX_SALE_DISCOUNT_RATE = 0.25;
  const SUNDAY_DISCOUNT_RATE = 0.1;

  // 장바구니에 담긴 아이템들의 총 가격, 개수, 할인된 가격을 계산합니다.
  const calcTotalCart = () => {
    const { items } = useCartStore();
    const { products } = useProductsStore();
    // 총 가격, 개수, 할인된 가격을 담는 변수들입니다.
    let totalPrice = 0,
      totalCount = 0,
      totalDiscountedPrice = 0;

    // 장바구니에 담긴 아이템의 가격과 할인율을 확인해 총 가격, 개수, 할인된 가격을 계산합니다.
    items.forEach(({ id, quantity }) => {
      const currentItem = products.find((product) => product.id === id);

      if (!currentItem) return;

      const currentTotalPrice = currentItem.price * quantity;
      // 한 상품 10개 이상 구매 시 정해진 할인율 적용
      const currentDiscountRate = quantity >= 10 ? currentItem.discountRate : 0;
      totalCount += quantity;
      totalPrice += currentTotalPrice;
      totalDiscountedPrice += currentTotalPrice * (1 - currentDiscountRate);
    });

    return { totalPrice, totalCount, totalDiscountedPrice };
  };

  // 현재 장바구니 속 아이템의 총 개수와 조건에 따라 할인율을 계산해 반환합니다.
  const getDiscountRate = (
    totalCount: number,
    totalPrice: number,
    totalDiscountedPrice: number,
  ) => {
    const discountedPrice = totalPrice - totalDiscountedPrice;
    let discountRate = (totalPrice - totalDiscountedPrice) / totalPrice;

    // 상품 종류와 상관 없이, 30개 이상 구매할 경우 25% 할인
    if (
      totalCount >= MAX_SALE_COUNT &&
      totalDiscountedPrice * MAX_SALE_DISCOUNT_RATE > discountedPrice
    ) {
      totalDiscountedPrice = totalDiscountedPrice =
        totalPrice * (1 - MAX_SALE_DISCOUNT_RATE);
      discountRate = MAX_SALE_DISCOUNT_RATE;
    }

    // 화요일에는 특별 할인 10%가 적용됩니다.
    if (new Date().getDay() === 2) {
      totalDiscountedPrice *= 1 - SUNDAY_DISCOUNT_RATE;
      discountRate = Math.max(discountRate, SUNDAY_DISCOUNT_RATE);
    }

    return discountRate;
  };

  const render = () => {
    // 장바구니 내 모든 상품의 총액과 할인율을 계산합니다.
    const { totalPrice, totalCount, totalDiscountedPrice } = calcTotalCart();
    const discountRate = getDiscountRate(
      totalCount,
      totalPrice,
      totalDiscountedPrice,
    );

    // 총액과 할인율, 포인트를 계산해 화면에 표시합니다.
    cartTotal.innerHTML = `총액: ${totalDiscountedPrice}원${
      discountRate > 0
        ? `<span class="text-green-500 ml-2">(${(discountRate * 100).toFixed(
            1,
          )}% 할인 적용)</span>`
        : ''
    }<span id="bonus-points" class="text-blue-500 ml-2">(포인트: ${Math.floor(
      totalDiscountedPrice / 1000,
    )})</span>`;
  };

  cartStore.subscribe(render);
  render();

  return cartTotal;
}
