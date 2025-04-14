import { products } from '@/shared/config/product';
import { createElement } from '@/shared/lib/utils';

// 상품 선택 옵션을 업데이트합니다.
export default function updateProductSelectOptions(productId: string) {
  const select = document.getElementById('product-select');

  if (!select) return;

  // productId가 빈 값이 아니라면 해당 상품의 옵션만 변경합니다.
  if (productId) {
    const product = products.find((product) => product.id === productId);
    const option = document.querySelector(
      `#product-select #product-select-option-${productId}`,
    ) as HTMLOptionElement;

    if (!product) return;

    option.textContent = `${product.name} - ${product.price}원`;
    option.disabled = !!(product.quantity === 0);
  } else {
    // productId가 빈 값이라면 전체 상품 옵션을 새로 설정합니다.
    select.innerHTML = '';

    products.forEach((product) => {
      createElement<HTMLOptionElement>(select, 'option', {
        id: `product-select-option-${product.id}`,
        value: product.id,
        textContent: `${product.name} - ${product.price}원`,
        disabled: !!(product.quantity === 0),
      });
    });
  }
}
