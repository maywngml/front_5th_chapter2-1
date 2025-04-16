import { createStore } from './createStore';
import { Product } from '../types/product';

// 장바구니에 담길 아이템 타입입니다.
type Item = Omit<Product, 'discountRate'>;

// 장바구니 상태 타입입니다. 아이템 목록과 총 금액을 포함합니다.
interface CartState {
  items: Item[];
  totalPrice: number;
}

// 장바구니 상태를 업데이트하는 액션의 타입을 정의합니다.
type CartAction = {
  addToCart: (state: CartState, newItem: Item) => CartState;
  deleteFromCart: (state: CartState, id: string) => CartState;
};

// 초기 상태와 액션 로직을 포함한 장바구니 스토어를 생성합니다.
export const cartStore = createStore<CartState, CartAction>(
  {
    items: [],
    totalPrice: 0,
  },
  {
    // 아이템을 장바구니에 추가합니다.
    addToCart(state, newItem) {
      const currentItem = state.items.find((item) => item.id === newItem.id);
      let newItems;

      // 아이템이 장바구니에 담겨 있다면 수량을 업데이트합니다.
      if (currentItem) {
        newItems = state.items.map((item) =>
          item.id === newItem.id
            ? { ...item, quantity: newItem.quantity }
            : item,
        );
      } else {
        // 추가하려는 아이템이 장바구니에 없다면 아이템을 새로 추가
        newItems = [...state.items, { ...newItem }];
      }

      // 총액을 새로 계산합니다.
      const newTotalPrice = state.totalPrice + newItem.price * newItem.quantity;

      return { items: newItems, totalPrice: newTotalPrice };
    },

    // 아이템을 장바구니에서 제거합니다.
    deleteFromCart(state, id) {
      const item = state.items.find((item) => item.id === id);

      // 해당 id의 아이템이 장바구니에 없다면 알림창을 띄우고 기존 상태를 반환합니다.
      if (!item) {
        alert('아이템을 장바구니에서 제거하는데 오류가 발생했습니다.');

        return { ...state };
      }

      // 아이템이 장바구니에 담겨있다면 아이템 목록에서 해당 아이템을 제외하고 총액을 다시 계산합니다.
      const newItems = state.items.filter((item) => item.id === id);
      const newTotalPrice = state.totalPrice - item.price * item.quantity;

      return { items: newItems, totalPrice: newTotalPrice };
    },
  },
);

// 장바구니 상태와 액션을 외부에서 간편하게 사용할 수 있도록 반환하는 훅입니다.
export function useCartStore() {
  return { ...cartStore.getState(), ...cartStore.actions };
}
