import {
  useState,
  createContext,
  useContext,
  ReactNode,
  useCallback,
  useMemo,
} from 'react';
import { initialProducts } from '../config/products';
import type { Product } from '../types/product';

interface ProductsContextType {
  products: Product[];
  lastSelectedProductId: string | null;
  updateProduct: (id: string, options: Partial<Product>) => void;
  updateLastSelectedProductId: (id: string) => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(
  undefined,
);

export const ProductsProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [lastSelectedProductId, setLastSelectedProductId] = useState<
    string | null
  >(null);

  const updateProduct = useCallback((id: string, options: Partial<Product>) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id ? { ...product, ...options } : product,
      ),
    );
  }, []);

  const updateLastSelectedProductId = useCallback((id: string) => {
    setLastSelectedProductId(id);
  }, []);

  const contextValue: ProductsContextType = useMemo(
    () => ({
      products,
      lastSelectedProductId,
      updateProduct,
      updateLastSelectedProductId,
    }),
    [
      products,
      lastSelectedProductId,
      updateProduct,
      updateLastSelectedProductId,
    ],
  );

  return (
    <ProductsContext.Provider value={contextValue}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error(
      'useProductsContext must be used within an ProductsProvider',
    );
  }
  return context;
};
