import { useProducts } from '../context/ProductsContext';

export default function StockStatus() {
  const { products } = useProducts();

  return (
    <div id='stock-status' className='text-sm text-gray-500 mt-2'>
      {products.map((product) => {
        if (product.quantity < 5) {
          return `${product.name}: ${
            product.quantity > 0
              ? '재고 부족 (' + product.quantity + '개 남음)'
              : '품절'
          }\n`;
        }
      })}
    </div>
  );
}
