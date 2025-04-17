import { createStore } from './createStore';
import { Product } from '../types/product';

// 장바구니에 담길 아이템 타입입니다.
export type Item = Omit<Product, 'discountRate'>;

// 장바구니 상태 타입입니다. 아이템 목록과 총 금액을 포함합니다.
interface CartState {
  items: Item[];
}
// TODO: 총액 업데이트 액션 추가하기
// 장바구니 상태를 업데이트하는 액션의 타입을 정의합니다.
type CartAction = {
  increaseCartItem: (
    state: CartState,
    newItem: Omit<Item, 'quantity'>,
  ) => CartState;
  decreaseCartItem: (state: CartState, id: string) => CartState;
  deleteFromCart: (state: CartState, id: string) => CartState;
};

// 초기 상태와 액션 로직을 포함한 장바구니 스토어를 생성합니다.
export const cartStore = createStore<CartState, CartAction>(
  {
    items: [],
  },
  {
    // 아이템을 장바구니에 추가하거나 수량을 증가시킵니다.
    increaseCartItem(state, newItem) {
      const currentItem = state.items.find((item) => item.id === newItem.id);
      let newItems;

      // 아이템이 장바구니에 담겨 있다면 수량을 증가시킵니다.
      if (currentItem) {
        newItems = state.items.map((item) =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      } else {
        // 추가하려는 아이템이 장바구니에 없다면 아이템을 새로 추가합니다.
        newItems = [...state.items, { ...newItem, quantity: 1 }];
      }

      return { items: newItems };
    },
    // 장바구니 속 아이템 수량을 감소시킵니다.
    decreaseCartItem(state, id) {
      const item = state.items.find((item) => item.id === id);
      let newItems;

      if (!item) {
        alert('아이템의 수량을 줄이는데 오류가 발생했습니다.');
        return { ...state };
      }

      if (item.quantity > 1) {
        newItems = state.items.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item,
        );
      } else {
        newItems = state.items.filter((item) => item.id !== id);
      }

      return { items: newItems };
    },

    // 아이템을 장바구니에서 제거합니다.
    deleteFromCart(state, id) {
      const item = state.items.find((item) => item.id === id);

      // 해당 id의 아이템이 장바구니에 없다면 알림창을 띄우고 기존 상태를 반환합니다.
      if (!item) {
        alert('아이템을 장바구니에서 제거하는데 오류가 발생했습니다.');
        return { ...state };
      }

      // 아이템 목록에서 해당 아이템을 제외합니다.
      const newItems = state.items.filter((item) => item.id !== id);

      return { items: newItems };
    },
  },
);

// 장바구니 상태와 액션을 외부에서 간편하게 사용할 수 있도록 반환하는 훅입니다.
export function useCartStore() {
  return { ...cartStore.getState(), ...cartStore.actions };
}
