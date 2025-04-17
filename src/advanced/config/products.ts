import type { Product } from '../types/product';

export const initialProducts: Product[] = [
  {
    id: 'p1',
    name: '상품1',
    price: 10_000,
    quantity: 50,
    discountRate: 0.1,
  },
  {
    id: 'p2',
    name: '상품2',
    price: 20_000,
    quantity: 30,
    discountRate: 0.15,
  },
  {
    id: 'p3',
    name: '상품3',
    price: 30_000,
    quantity: 20,
    discountRate: 0.2,
  },
  {
    id: 'p4',
    name: '상품4',
    price: 15_000,
    quantity: 0,
    discountRate: 0.05,
  },
  {
    id: 'p5',
    name: '상품5',
    price: 25_000,
    quantity: 10,
    discountRate: 0.25,
  },
];
