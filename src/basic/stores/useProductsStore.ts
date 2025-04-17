import { createStore } from './createStore';
import type { Product } from '../types/product';

interface ProductsState {
  products: Product[];
  lastSelectedProductId: string | null;
}

type ProductsAction = {
  updateProduct: (
    state: ProductsState,
    id: string,
    options: Partial<Product>,
  ) => ProductsState;
  updateLastSelectedProductId: (
    state: ProductsState,
    id: string,
  ) => ProductsState;
};

export const productsStore = createStore<ProductsState, ProductsAction>(
  {
    products: [
      {
        id: 'p1',
        name: '상품1',
        price: 10000,
        quantity: 50,
        discountRate: 0.1,
      },
      {
        id: 'p2',
        name: '상품2',
        price: 20000,
        quantity: 30,
        discountRate: 0.15,
      },
      {
        id: 'p3',
        name: '상품3',
        price: 30000,
        quantity: 20,
        discountRate: 0.2,
      },
      {
        id: 'p4',
        name: '상품4',
        price: 15000,
        quantity: 0,
        discountRate: 0.05,
      },
      {
        id: 'p5',
        name: '상품5',
        price: 25000,
        quantity: 10,
        discountRate: 0.25,
      },
    ],
    lastSelectedProductId: null,
  },
  {
    updateProduct(state: ProductsState, id: string, options: Partial<Product>) {
      const newProducts = state.products.map((product) =>
        product.id === id ? { ...product, ...options } : product,
      );
      return { ...state, products: newProducts };
    },
    updateLastSelectedProductId(state: ProductsState, id: string) {
      return { ...state, lastSelectedProductId: id };
    },
  },
);

export function useProductsStore() {
  return { ...productsStore.getState(), ...productsStore.actions };
}
