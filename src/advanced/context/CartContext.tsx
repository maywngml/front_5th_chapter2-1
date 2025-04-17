import {
  useState,
  createContext,
  useContext,
  ReactNode,
  useCallback,
  useMemo,
} from 'react';
import type { Product } from '../types/product';

// 장바구니에 담길 아이템 타입입니다.
export type Item = Omit<Product, 'discountRate'>;

// 장바구니 상태 타입입니다. 아이템 목록과 총 금액을 포함합니다.
interface CartContextType {
  items: Item[];
  increaseCartItem: (newItem: Omit<Item, 'quantity'>) => void;
  decreaseCartItem: (id: string) => void;
  deleteFromCart: (id: string) => void;
}
const CartContext = createContext<CartContextType | undefined>(undefined);

// 아이템을 장바구니에 추가하거나 수량을 증가시킵니다.
const increaseOrUpdateItem = (
  prevItems: Item[],
  newItem: Omit<Item, 'quantity'>,
): Item[] => {
  const existingItem = prevItems.find((item) => item.id === newItem.id);

  // 장바구니에 아이템이 없으면 새로 추가합니다.
  if (!existingItem) {
    return [...prevItems, { ...newItem, quantity: 1 }];
  }

  // 장바구니에 아이템이 있으면 수량을 증가시킵니다.
  return prevItems.map((item) =>
    item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item,
  );
};

// 장바구니에서 아이템을 삭제하거나 수량을 감소시킵니다.
const decreaseOrDeleteItem = (prevItems: Item[], id: string): Item[] => {
  const existingItem = prevItems.find((item) => item.id === id);

  // 장바구니에 아이템이 있고 수량이 1보다 크다면 수량을 감소시키고 아니면 아이템을 제거합니다.
  if (existingItem) {
    if (existingItem.quantity > 1) {
      return prevItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item,
      );
    } else {
      return prevItems.filter((item) => item.id !== id);
    }
  } else {
    // 장바구니에 아이템이 없으면 이전 아이템을 그대로 반환합니다.
    return prevItems;
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<Item[]>([]);

  // 아이템을 장바구니에 추가하거나 수량을 증가시킵니다.
  const increaseCartItem = useCallback((newItem: Omit<Item, 'quantity'>) => {
    setItems((prevItems) => increaseOrUpdateItem(prevItems, newItem));
  }, []);

  // 장바구니에서 아이템을 삭제하거나 수량을 감소시킵니다.
  const decreaseCartItem = useCallback((id: string) => {
    setItems((prevItems) => decreaseOrDeleteItem(prevItems, id));
  }, []);

  // 장바구니에서 아이템을 삭제합니다.
  const deleteFromCart = useCallback((id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  }, []);

  const contextValue: CartContextType = useMemo(
    () => ({
      items,
      increaseCartItem,
      decreaseCartItem,
      deleteFromCart,
    }),
    [items, increaseCartItem, decreaseCartItem, deleteFromCart],
  );

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCartContext must be used within an CartProvider');
  }
  return context;
};
