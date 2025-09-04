// app/cart/page.tsx
import { readCart } from './actions';
import CartClient from './CartClient';

export const dynamic = 'force-dynamic'; // корзина зависит от куки

export default async function CartPage() {
  const order = await readCart();

  return <CartClient initialOrder={order} />;
}
