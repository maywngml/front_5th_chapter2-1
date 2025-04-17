import { productsStore, useProductsStore } from '../stores';

export default function StockStatus() {
  const stockStatus = document.createElement('div');
  stockStatus.id = 'stock-status';
  stockStatus.className = 'text-sm text-gray-500 mt-2';

  const render = () => {
    const { products } = useProductsStore();

    stockStatus.innerHTML = `
      ${products
        .map((product) => {
          if (product.quantity < 5) {
            return `${product.name}: ${
              product.quantity > 0
                ? '재고 부족 (' + product.quantity + '개 남음)'
                : '품절'
            }\n`;
          }
        })
        .join('')}
    `;
  };

  productsStore.subscribe(render);
  render();

  return stockStatus;
}
