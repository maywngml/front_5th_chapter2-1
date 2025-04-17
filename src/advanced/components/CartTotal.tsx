import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductsContext';
import { calcTotalCart, getDiscountRate } from '@/advanced/lib/utils/cart';

export default function CartTotal() {
  const { products } = useProducts();
  const { items } = useCart();

  const { totalPrice, totalCount, totalDiscountedPrice } = calcTotalCart(
    items,
    products,
  );
  const discountRate = getDiscountRate(
    totalCount,
    totalPrice,
    totalDiscountedPrice,
  );

  return (
    <div id='cart-total' className='text-xl font-bold my-4'>
      총액: {totalDiscountedPrice}원
      {discountRate > 0 && (
        <span className='text-green-500 ml-2'>
          ({(discountRate * 100).toFixed(1)}% 할인 적용)
        </span>
      )}
      <span id='bonus-points' className='text-blue-500 ml-2'>
        (포인트: {Math.floor(totalDiscountedPrice / 1000)})
      </span>
    </div>
  );
}
