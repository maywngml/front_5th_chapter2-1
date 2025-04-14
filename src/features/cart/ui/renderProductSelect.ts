import { createElement } from '@/shared/lib/utils';
import { BASE_STYLES } from '@/shared/styles/base';

export default function renderProductSelect() {
  const root = document.getElementById('wrapper');

  if (!root) {
    return;
  }

  createElement<HTMLSelectElement>(root, 'select', {
    id: 'product-select',
    className: BASE_STYLES.PRODUCT_SELECT,
  });
}
