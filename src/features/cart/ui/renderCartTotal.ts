import { createElement } from '@/shared/lib/utils';
import { BASE_STYLES } from '@/shared/styles/base';

export default function renderCartTotal(): HTMLDivElement | null {
  const root = document.getElementById('wrapper');

  if (!root) {
    return null;
  }

  const cartTotal = createElement<HTMLDivElement>(root, 'div', {
    id: 'cart-total',
    className: BASE_STYLES.CART_TOTAL,
  });

  return cartTotal;
}
