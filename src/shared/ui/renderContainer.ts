import { createElement } from '../lib/utils';
import { BASE_STYLES } from '../styles/base';

export default function renderContainer() {
  const root = document.getElementById('app');

  if (!root) {
    return;
  }

  createElement<HTMLDivElement>(root, 'div', {
    id: 'container',
  });
  const wrapper = createElement<HTMLDivElement>(root, 'div', {
    id: 'wrapper',
    className: BASE_STYLES.WRAPPER,
  });
  createElement(wrapper, 'h1', {
    className: BASE_STYLES.TITLE,
    textContent: '장바구니',
  });
  createElement(wrapper, 'div', { id: 'cart-items' });
}
