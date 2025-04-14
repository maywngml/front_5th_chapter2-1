import { createElement } from '../shared/lib/utils';
import { products } from '../shared/config/product';

// 화면에 돔을 그리는 함수입니다.
function renderElement() {
  const root = document.getElementById('app');
  createElement(root, 'div', { id: 'container' });

  const container = document.getElementById('container');
  createElement(container, 'div', {
    id: 'wrapper',
    className:
      'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8',
  });

  const wrapper = document.getElementById('wrapper');
  createElement(wrapper, 'h1', {
    className: 'text-2xl font-bold mb-4',
    textContent: '장바구니',
  });
  createElement(wrapper, 'div', { id: 'cart-items' });
  createElement(wrapper, 'div', {
    id: 'cart-total',
    className: 'text-xl font-bold my-4',
  });
  createElement(wrapper, 'select', {
    id: 'product-select',
    className: 'border rounded p-2 mr-2',
  });
  createElement(wrapper, 'button', {
    id: 'add-to-cart',
    className: 'bg-blue-500 text-white px-4 py-2 rounded',
    textContent: '추가',
  });
  createElement(wrapper, 'div', {
    id: 'stock-status',
    className: 'text-sm text-gray-500 mt-2',
  });
}

function main() {
  var lastSel;

  renderElement();

  updateSelectOptions();

  updateCart();
  setTimeout(function () {
    // 타임 세일 팝업 임시로 막아놓음
    // setInterval(function () {
    //   var luckyItem=products[Math.floor(Math.random() * products.length)];
    //   if(Math.random() < 0.3 && luckyItem.q > 0) {
    //     luckyItem.price=Math.round(luckyItem.price * 0.8);
    //     alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
    //     updateSelectOptions();
    //   }
    // }, 30000);
  }, Math.random() * 10000);
  setTimeout(function () {
    // setInterval(function () {
    //   if (lastSel) {
    //     var suggest = products.find(function (item) {
    //       return item.id !== lastSel && item.q > 0;
    //     });
    //     if (suggest) {
    //       alert(
    //         suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!',
    //       );
    //       suggest.price = Math.round(suggest.price * 0.95);
    //       updateSelectOptions();
    //     }
    //   }
    // }, 60000);
  }, Math.random() * 20000);
}

// 상품 선택 옵션을 업데이트합니다.
function updateSelectOptions() {
  const select = document.getElementById('product-select');
  select.innerHTML = '';

  products.forEach((product) => {
    const option = document.createElement('option');
    option.value = product.id;
    option.textContent = `${product.name} - ${product.price}원`;

    if (product.quantity === 0) {
      option.disabled = true;
    }
    select.appendChild(option);
  });
}

// 현재 장바구니 속 아이템의 총 개수와 조건에 따라 할인율을 계산해 반환합니다.
function getDiscountRate(totalCount, totalPrice, totalDiscountedPrice) {
  let discountRate = 0;

  // 총 수량이 30개 이상일 경우 추가 할인 적용 여부를 검토합니다.
  if (totalCount >= 30) {
    const currentDiscount = totalPrice - totalDiscountedPrice;
    // 기존 할인 금액보다 25% 할인이 더 클 경우, 25% 할인을 적용합니다.
    if (totalDiscountedPrice * 0.25 > currentDiscount) {
      totalDiscountedPrice = totalPrice * (1 - 0.25);
      discountRate = 0.25;
    } else {
      discountRate = (totalPrice - totalDiscountedPrice) / totalPrice;
    }
  } else {
    discountRate = (totalPrice - totalDiscountedPrice) / totalPrice;
  }

  // 화요일에는 특별 할인이 적용됩니다.
  if (new Date().getDay() === 2) {
    totalDiscountedPrice *= 1 - 0.1;
    discountRate = Math.max(discountRate, 0.1);
  }

  return discountRate;
}

// 장바구니에 담긴 아이템들의 총 가격, 개수, 할인된 가격을 계산합니다.
function calcTotalCart() {
  const cartItems = document.getElementById('cart-items');
  // 장바구니에 담긴 아이템들이 담긴 엘리먼트 배열
  const cartItemElements = cartItems.children;
  // 총 가격, 개수, 할인된 가격을 담는 변수들입니다.
  let totalPrice = 0,
    totalCount = 0,
    totalDiscountedPrice = 0;

  // 장바구니에 담긴 아이템의 가격과 할인율을 확인해 총 가격, 개수, 할인된 가격을 계산합니다.
  for (const cartItemElement of cartItemElements) {
    const currentItem = products.find(
      (product) => product.id === cartItemElement.id,
    );
    const currentCount = parseInt(
      cartItemElement.querySelector('span').textContent.split('x ')[1],
    );
    const currentTotalPrice = currentItem.price * currentCount;
    const currentDiscountRate =
      currentCount >= 10 ? currentItem.discountRate : 0;

    totalCount += currentCount;
    totalPrice += currentTotalPrice;
    totalDiscountedPrice += currentTotalPrice * (1 - currentDiscountRate);
  }

  return { totalPrice, totalCount, totalDiscountedPrice };
}

// 장바구니에 총액과 할인율을 표시합니다.
function renderTotalPrice(totalDiscountedPrice, discountRate) {
  const cartTotal = document.getElementById('cart-total');

  cartTotal.textContent = `총액: ${Math.round(totalDiscountedPrice)}원`;

  if (discountRate > 0) {
    const span = document.createElement('span');

    span.className = 'text-green-500 ml-2';
    span.textContent = `(${(discountRate * 100).toFixed(1)}% 할인 적용)`;

    cartTotal.appendChild(span);
  }
}

// 장바구니 정보를 업데이트합니다.
function updateCart() {
  const { totalPrice, totalCount, totalDiscountedPrice } = calcTotalCart();
  const discountRate = getDiscountRate(
    totalCount,
    totalPrice,
    totalDiscountedPrice,
  );

  renderTotalPrice(totalDiscountedPrice, discountRate);
  updateStockInfo();
  renderBonusPoints(totalDiscountedPrice);
}

// 총액에 따른 보너스 포인트 점수를 계산하고 화면에 보여줍니다.
const renderBonusPoints = (totalAmount) => {
  const cartTotal = document.getElementById('cart-total');
  const bonusPoints = Math.floor(totalAmount / 1000);
  let pointsTag = document.getElementById('loyalty-points');

  if (!pointsTag) {
    pointsTag = document.createElement('span');
    pointsTag.id = 'loyalty-points';
    pointsTag.className = 'text-blue-500 ml-2';
    cartTotal.appendChild(pointsTag);
  }

  pointsTag.textContent = `(포인트: ${bonusPoints})`;
};

// 상품들의 재고 정보를 업데이트합니다.
function updateStockInfo() {
  const stockInfo = document.getElementById('stock-status');
  let infoMsg = '';

  products.forEach(function (item) {
    if (item.quantity < 5) {
      infoMsg += `${item.name}: ${
        item.quantity > 0 ? '재고 부족 (' + item.quantity + '개 남음)' : '품절'
      }\n`;
    }
  });

  stockInfo.textContent = infoMsg;
}

main();

function handleClickAddToCart() {
  // 계산에 필요한 엘리먼트 취득
  const cartItems = document.getElementById('cart-items');
  const productSelect = document.getElementById('product-select');

  // 선택한 상품의 아이디와 정보를 가져옵니다.
  const selectedProductId = productSelect.value;
  const selectedProduct = products.find(
    (product) => product.id === selectedProductId,
  );

  // 선택된 상품의 재고가 없다면 리턴합니다.
  if (selectedProduct?.quantity <= 0) return;

  const product = document.getElementById(selectedProduct.id);

  // 이미 장바구니에 상품이 추가된 상태라면 재고 현황에 따라 수량을 추가하거나 알림창을 표시합니다.
  if (product) {
    const newQuantity =
      parseInt(product.querySelector('span').textContent.split('x ')[1]) + 1;

    // 장바구니에 입력될 수량이 현재 상품의 재고보다 적을 때는 수량을 추가합니다.
    if (newQuantity <= selectedProduct.quantity) {
      product.querySelector('span').textContent =
        `${selectedProduct.name} - ${selectedProduct.price}원 x ${newQuantity}`;
      selectedProduct.quantity--;
    } else {
      // 수량이 현재 상품 재고보다 크다면 알림창을 표시합니다.
      alert('재고가 부족합니다.');
    }
  } else {
    // 상품이 추가되어 있지 않다면 새로 추가합니다.
    const innerHTML = `<span> ${selectedProduct.name} - ${selectedProduct.price}원 x 1</span><div><button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${selectedProduct.id}" data-change="-1">-</button><button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${selectedProduct.id}" data-change="1">+</button><button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${selectedProduct.id}">삭제</button></div>`;

    createElement(cartItems, 'div', {
      id: selectedProduct.id,
      className: 'flex justify-between items-center mb-2',
      innerHTML,
    });

    selectedProduct.quantity--;
  }

  updateCart();
  lastSel = selectedProductId;
}

function changeProductQuantity(change, element, product) {
  const changeQuantity = parseInt(change);
  let textContent = element.querySelector('span').textContent;
  const newQuantity = parseInt(textContent.split('x ')[1]) + changeQuantity;

  // 변경될 수량이 0과 같거나 작다면 장바구니에서 해당 상품을 제거합니다.
  if (newQuantity <= 0) {
    element.remove();
    product.quantity -= changeQuantity;
  } else if (changeQuantity <= product.quantity) {
    // 상품 재고가 충분하다면 수량을 변경합니다.
    element.querySelector('span').textContent = textContent.replace(
      /x\s*\d+$/,
      `x ${newQuantity}`,
    );
    product.quantity -= changeQuantity;
  } else {
    // 재고가 부족하다면 알림창을 표시합니다.
    alert('재고가 부족합니다.');
  }
}

function removeProductFromCart(element, product) {
  const removeQuantity = parseInt(
    element.querySelector('span').textContent.split('x ')[1],
  );
  product.quantity += removeQuantity;
  element.remove();
}

function handleClickCartItems(event) {
  const target = event.target;
  if (
    target.classList.contains('quantity-change') ||
    target.classList.contains('remove-item')
  ) {
    const productId = target.dataset.productId;
    const productElement = document.getElementById(productId);
    const product = products.find((product) => product.id === productId);

    if (target.classList.contains('quantity-change')) {
      changeProductQuantity(target.dataset.change, productElement, product);
    } else if (target.classList.contains('remove-item')) {
      removeProductFromCart(productElement, product);
    }

    updateCart();
  }
}

document
  .getElementById('add-to-cart')
  .addEventListener('click', handleClickAddToCart);

document
  .getElementById('cart-items')
  .addEventListener('click', handleClickCartItems);
