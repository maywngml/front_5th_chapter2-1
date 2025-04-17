import { createElement } from '../shared/lib/utils';
import { products } from '../shared/config/product';
import { BASE_STYLES } from '../shared/styles/base';
import { HomePage } from './pages';

// TODO: 파일 분리
let lastSelectedProductId;

// 화면에 돔을 그리는 함수입니다.
const renderElement = () => {
  // 페이지 컴포넌트를 호출합니다.
  HomePage();

  // wrapper 엘리먼트에 제목, 셀렉트 엘리먼트 등을 추가합니다.
  const wrapper = document.getElementById('wrapper');

  createElement(wrapper, 'div', {
    id: 'stock-status',
    className: BASE_STYLES.STOCK_STATUS,
  });
};

// TODO: 함수 주석은 더 상세하게 달기
// 랜덤하게 선택된 상품에 대해 세일이 진행 중임을 알립니다.
const notifyLuckySale = () => {
  setInterval(() => {
    // 랜덤으로 세일을 진행할 상품을 선택합니다.
    const luckyItem = products[Math.floor(Math.random() * products.length)];

    // 해당 상품의 재고가 남아있다면 가격을 변경하고 알림창을 띄웁니다.
    if (luckyItem.quantity > 0) {
      luckyItem.price = Math.round(luckyItem.price * 0.8);

      alert(`번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
      updateSelectOptions(luckyItem.id);
    }
  }, 30000);
};

// 재고가 남아있는 상품 중 하나를 선택해 추가 할인을 적용합니다.
const notifyPurchaseSuggestion = () => {
  setInterval(() => {
    if (!lastSelectedProductId) return;

    // 재고가 있으며 마지막에 추가된 상품이 아닌 다른 상품을 선택합니다.
    const suggestedProduct = products.find(
      (product) => product.id !== lastSelectedProductId && product.quantity > 0,
    );

    // 위 조건에 부합하는 상품이 있을 경우 해당 상품 가격을 변경하고 알림창을 생성합니다.
    if (suggestedProduct) {
      suggestedProduct.price = Math.round(suggestedProduct.price * 0.95);

      alert(
        `${suggestedProduct.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`,
      );
      updateSelectOptions(suggestedProduct.id);
    }
  }, 60000);
};

// 상품 선택 옵션을 업데이트합니다.
const updateSelectOptions = (productId) => {
  const select = document.getElementById('product-select');

  // productId가 빈 값이 아니라면 해당 상품의 옵션만 변경합니다.
  if (productId) {
    const product = products.find((product) => product.id === productId);
    const option = document.querySelector(
      `#product-select #product-select-option-${productId}`,
    );

    option.textContent = `${product.name} - ${product.price}원`;
    option.disabled = !!(product.quantity === 0);
  } else {
    // productId가 빈 값이라면 전체 상품 옵션을 새로 설정합니다.
    select.innerHTML = '';

    products.forEach((product) => {
      createElement(select, 'option', {
        id: `product-select-option-${product.id}`,
        value: product.id,
        textContent: `${product.name} - ${product.price}원`,
        disabled: !!(product.quantity === 0),
      });
    });
  }
};

// 상품들의 재고 정보를 업데이트합니다.
const updateStockInfo = () => {
  const stockInfo = document.getElementById('stock-status');
  let infoMsg = '';

  products.forEach((item) => {
    if (item.quantity < 5) {
      infoMsg += `${item.name}: ${
        item.quantity > 0 ? '재고 부족 (' + item.quantity + '개 남음)' : '품절'
      }\n`;
    }
  });

  stockInfo.textContent = infoMsg;
};

const main = () => {
  renderElement();
  updateSelectOptions();
  notifyLuckySale();
  notifyPurchaseSuggestion();
};

main();
