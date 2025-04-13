import { products } from '../shared/config/product';

var sel, addBtn, cartItems, sum, stockInfo;
var lastSel;
function main() {
  var root = document.getElementById('app');
  let cont = document.createElement('div');
  var wrap = document.createElement('div');
  let hTxt = document.createElement('h1');
  cartItems = document.createElement('div');
  sum = document.createElement('div');
  sel = document.createElement('select');
  addBtn = document.createElement('button');
  stockInfo = document.createElement('div');
  cartItems.id = 'cart-items';
  sum.id = 'cart-total';
  sel.id = 'product-select';
  addBtn.id = 'add-to-cart';
  stockInfo.id = 'stock-status';
  cont.className = 'bg-gray-100 p-8';
  wrap.className =
    'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';
  hTxt.className = 'text-2xl font-bold mb-4';
  sum.className = 'text-xl font-bold my-4';
  sel.className = 'border rounded p-2 mr-2';
  addBtn.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  stockInfo.className = 'text-sm text-gray-500 mt-2';
  hTxt.textContent = '장바구니';
  addBtn.textContent = '추가';
  updateSelectOptions();
  wrap.appendChild(hTxt);
  wrap.appendChild(cartItems);
  wrap.appendChild(sum);
  wrap.appendChild(sel);
  wrap.appendChild(addBtn);
  wrap.appendChild(stockInfo);
  cont.appendChild(wrap);
  root.appendChild(cont);
  calcCart();
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
  sel.innerHTML = '';

  products.forEach((product) => {
    const option = document.createElement('option');
    option.value = product.id;
    option.textContent = `${product.name} - ${product.price}원`;

    if (product.quantity === 0) {
      option.disabled = true;
    }
    sel.appendChild(option);
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

// 장바구니에 담긴 아이템의 총 가격을 계산합니다.
function calcCart() {
  const cartItemElements = cartItems.children;
  let totalPrice = 0,
    totalCount = 0,
    // TODO: 변수명 더 직관적으로 변경
    totalDiscountedPrice = 0;
  // 장바구니에 담긴 아이템의 정보로
  for (const cartItemElement of cartItemElements) {
    const currentItem = products.find(
      (product) => product.id === cartItemElement.id,
    );
    const quantity = parseInt(
      cartItemElement.querySelector('span').textContent.split('x ')[1],
    );
    const subTotalPrice = currentItem.price * quantity;
    const discount = quantity >= 10 ? currentItem.discount : 0;
    totalCount += quantity;
    totalPrice += subTotalPrice;
    totalDiscountedPrice += subTotalPrice * (1 - discount);
  }

  const discountRate = getDiscountRate(
    totalCount,
    totalPrice,
    totalDiscountedPrice,
  );

  sum.textContent = '총액: ' + Math.round(totalDiscountedPrice) + '원';
  if (discountRate > 0) {
    var span = document.createElement('span');
    span.className = 'text-green-500 ml-2';
    span.textContent = '(' + (discountRate * 100).toFixed(1) + '% 할인 적용)';
    sum.appendChild(span);
  }

  updateStockInfo();
  renderBonusPoints(totalDiscountedPrice);
}
// 총액에 따른 보너스 포인트 점수를 계산하고 화면에 보여줍니다.
const renderBonusPoints = (totalAmount) => {
  const bonusPoints = Math.floor(totalAmount / 1000);
  let pointsTag = document.getElementById('loyalty-points');

  if (!pointsTag) {
    pointsTag = document.createElement('span');
    pointsTag.id = 'loyalty-points';
    pointsTag.className = 'text-blue-500 ml-2';
    sum.appendChild(pointsTag);
  }

  pointsTag.textContent = `(포인트: ${bonusPoints})`;
};
// 상품들의 재고 정보를 업데이트합니다.
function updateStockInfo() {
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
addBtn.addEventListener('click', function () {
  var selItem = sel.value;
  var itemToAdd = products.find(function (p) {
    return p.id === selItem;
  });
  if (itemToAdd && itemToAdd.quantity > 0) {
    var item = document.getElementById(itemToAdd.id);
    console.log(itemToAdd.quantity);

    if (item) {
      var newQty =
        parseInt(item.querySelector('span').textContent.split('x ')[1]) + 1;
      if (newQty <= itemToAdd.quantity) {
        item.querySelector('span').textContent =
          itemToAdd.name + ' - ' + itemToAdd.price + '원 x ' + newQty;
        itemToAdd.quantity--;
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      var newItem = document.createElement('div');
      newItem.id = itemToAdd.id;
      newItem.className = 'flex justify-between items-center mb-2';
      newItem.innerHTML =
        '<span>' +
        itemToAdd.name +
        ' - ' +
        itemToAdd.price +
        '원 x 1</span><div>' +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
        itemToAdd.id +
        '" data-change="-1">-</button>' +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
        itemToAdd.id +
        '" data-change="1">+</button>' +
        '<button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="' +
        itemToAdd.id +
        '">삭제</button></div>';
      cartItems.appendChild(newItem);
      itemToAdd.quantity--;
    }
    calcCart();
    lastSel = selItem;
  }
});
// 나름 이벤트 위임인 것 같은데, 수량변경 or 삭제 버튼 클릭 핸들러 함수
cartItems.addEventListener('click', function (event) {
  var tgt = event.target;
  if (
    tgt.classList.contains('quantity-change') ||
    tgt.classList.contains('remove-item')
  ) {
    var prodId = tgt.dataset.productId;
    var itemElem = document.getElementById(prodId);
    // find 안의 함수를 이렇게 번거롭게 작성할 필요가 있나
    var prod = products.find(function (p) {
      return p.id === prodId;
    });
    if (tgt.classList.contains('quantity-change')) {
      var qtyChange = parseInt(tgt.dataset.change);
      var newQty =
        parseInt(itemElem.querySelector('span').textContent.split('x ')[1]) +
        qtyChange;
      if (
        newQty > 0 &&
        newQty <=
          prod.quantity +
            parseInt(itemElem.querySelector('span').textContent.split('x ')[1])
      ) {
        itemElem.querySelector('span').textContent =
          itemElem.querySelector('span').textContent.split('x ')[0] +
          'x ' +
          newQty;
        prod.quantity -= qtyChange;
      } else if (newQty <= 0) {
        itemElem.remove();
        prod.quantity -= qtyChange;
      } else {
        alert('재고가 부족합니다.');
      }
    } else if (tgt.classList.contains('remove-item')) {
      var remQty = parseInt(
        itemElem.querySelector('span').textContent.split('x ')[1],
      );
      prod.quantity += remQty;
      itemElem.remove();
    }
    calcCart();
  }
});
