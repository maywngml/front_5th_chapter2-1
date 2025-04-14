import { createElement } from '@/shared/lib/utils';
import { BASE_STYLES } from '@/shared/styles/base';

// 장바구니에 총액과 할인율을 표시합니다.
export default function renderTotalPrice(
  totalDiscountedPrice: number,
  discountRate: number,
) {
  const cartTotal = document.getElementById('cart-total');

  if (!cartTotal) return;

  // 최종 금액을 화면에 표시합니다.
  cartTotal.textContent = `총액: ${Math.round(totalDiscountedPrice)}원`;

  // 할인이 적용될 경우에만 할인율을 화면에 표시합니다.
  if (discountRate > 0) {
    createElement(cartTotal, 'span', {
      className: BASE_STYLES.CART_TOTAL,
      textContent: `(${(discountRate * 100).toFixed(1)}% 할인 적용)`,
    });
  }
}
