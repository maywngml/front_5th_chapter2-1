import { createElement } from '@/shared/lib/utils';
import { BASE_STYLES } from '@/shared/styles/base';

// 총액에 따른 보너스 포인트 점수를 계산하고 화면에 보여줍니다.
export default function updateBonusPoints(totalAmount: number) {
  const cartTotal = document.getElementById('cart-total');
  const bonusPoints = Math.floor(totalAmount / 1000);
  let pointsTag = document.getElementById('bonus-points');

  if (!pointsTag && cartTotal) {
    pointsTag = createElement(cartTotal, 'span', {
      id: 'bonus-points',
      className: BASE_STYLES.LOYALTY_POINTS,
    });
  }

  if (pointsTag) {
    pointsTag.textContent = `(포인트: ${bonusPoints})`;
  }
}
