import { products } from '@/shared/config/product';
import { createStore } from './createStore';

// 장바구니에 담길 상품의 타입입니다.
interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

// 장바구니 상태 타입입니다. 상품 목록과 총 금액을 포함합니다.
interface CartState {
  products: Product[];
  totalPrice: number;
}

// 장바구니 상태를 업데이트하는 액션의 타입을 정의합니다.
type CartAction = {
  addToCart: (state: CartState, id: string, quantity: number) => CartState;
  deleteFromCart: (state: CartState, id: string) => CartState;
};

// 초기 상태와 액션 로직을 포함한 장바구니 스토어를 생성합니다.
const cartStore = createStore<CartState, CartAction>(
  {
    products: [],
    totalPrice: 0,
  },
  {
    // 상품을 장바구니에 추가합니다.
    addToCart(state, id, quantity) {
      const product = state.products.find((product) => product.id === id);

      // 해당 id의 상품이 장바구니에 없다면 알림창을 띄우고 기존 상태를 반환합니다.
      if (!product) {
        alert('상품을 장바구니에 추가하는데 오류가 발생했습니다.');

        return { ...state };
      }

      // 상품이 장바구니에 담겨 있다면 수량을 업데이트하고 총액을 계산합니다.
      const newProducts = state.products.map((product) =>
        product.id === id ? { ...product, quantity } : product,
      );
      const newTotalPrice = state.totalPrice + product.price * quantity;

      return { products: newProducts, totalPrice: newTotalPrice };
    },

    // 상품을 장바구니에서 제거합니다.
    deleteFromCart(state, id) {
      const product = state.products.find((product) => product.id === id);

      // 해당 id의 상품이 장바구니에 없다면 알림창을 띄우고 기존 상태를 반환합니다.
      if (!product) {
        alert('상품을 장바구니에서 제거하는데 오류가 발생했습니다.');

        return { ...state };
      }

      // 상품이 장바구니에 담겨있다면 상품 목록에서 해당 상품을 제외하고 총액을 다시 계산합니다.
      const newProducts = products.filter((product) => product.id === id);
      const newTotalPrice = state.totalPrice - product.price * product.quantity;

      return { products: newProducts, totalPrice: newTotalPrice };
    },
  },
);

// 장바구니 상태와 액션을 외부에서 간편하게 사용할 수 있도록 반환하는 훅입니다.
export default function useCartStore() {
  return { ...cartStore.getState(), ...cartStore.actions };
}
