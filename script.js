// DOM-элементы
const productsContainer = document.getElementById('products-container');
const cartDropdown = document.getElementById('cart-dropdown');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.getElementById('cart-count');
const cartBtn = document.getElementById('cart-btn');
const checkoutBtn = document.getElementById('checkout-btn');
const orderModal = document.getElementById('order-modal');
const successModal = document.getElementById('success-modal');
const closeModal = document.getElementById('close-modal');
const orderForm = document.getElementById('order-form');

// Состояние
let cart = JSON.parse(localStorage.getItem('simracing_cart')) || [];
let isCartOpen = false;

const formatPrice = p => new Intl.NumberFormat('ru-RU').format(p) + ' ₽';

// Обновление корзины 
function updateCart() {
  localStorage.setItem('simracing_cart', JSON.stringify(cart));
  renderCart();
}

// Создание элементов
function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card';
  card.innerHTML = `
    <div class="product-image"><img src="${product.image}" alt="${product.name}" /></div>
    <div class="product-info">
      <h3 class="product-title">${product.name}</h3>
      <p class="product-description">${product.description}</p>
      <div class="product-price">${formatPrice(product.price)}</div>
      <button class="add-to-cart" data-id="${product.id}">Добавить в корзину</button>
    </div>
  `;
  return card;
}

function createCartItem(item) {
  const cartItem = document.createElement('div');
  cartItem.className = 'cart-item';
  cartItem.innerHTML = `
    <div class="cart-item-info">
      <div class="cart-item-title">${item.name}</div>
      <div class="cart-item-price">${formatPrice(item.price)}</div>
    </div>
    <div class="cart-item-quantity">
      <button class="quantity-btn minus" data-id="${item.id}">-</button>
      <span>${item.quantity}</span>
      <button class="quantity-btn plus" data-id="${item.id}">+</button>
    </div>
    <button class="remove-item" data-id="${item.id}">×</button>
  `;
  return cartItem;
}

// Рендер товаров
function renderProducts() {
  productsContainer.innerHTML = '';
  products.forEach(product => {
    productsContainer.appendChild(createProductCard(product));
  });
}

// Корзина
function renderCart() {
  const totalQuantity = cart.reduce((t, i) => t + i.quantity, 0);

  if (totalQuantity > 0) {
    cartCount.style.display = 'flex';
    cartCount.textContent = totalQuantity;
  } else {
    cartCount.style.display = 'none';
  }

  cartItems.innerHTML = '';
  
  if (cart.length > 0) {
    cart.forEach(item => {
      cartItems.appendChild(createCartItem(item));
    });
  } else {
    const emptyCart = document.createElement('div');
    emptyCart.className = 'empty-cart';
    emptyCart.textContent = 'Ваша корзина пуста';
    cartItems.appendChild(emptyCart);
  }

  cartTotal.textContent = formatPrice(cart.reduce((s, i) => s + i.price * i.quantity, 0));
}

// Переключение корзины
function toggleCart(open) {
  cartDropdown.classList.toggle('active', open);
  cartBtn.setAttribute('aria-expanded', open);
  isCartOpen = open;
}

// Добавление товара
function addToCart(id) {
  const item = cart.find(i => i.id === id);
  item ? item.quantity++ : cart.push({ ...products.find(p => p.id === id), quantity: 1 });
  updateCart(); 
  toggleCart(true);
}

// Изменение количества
function changeQuantity(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) cart = cart.filter(i => i.id !== id);
  updateCart(); 
}

// Обработка кликов
function handleDocumentClick(e) {
  const id = +e.target.dataset.id;

  if (e.target.classList.contains('add-to-cart')) return addToCart(id);
  if (e.target.classList.contains('plus')) return changeQuantity(id, 1);
  if (e.target.classList.contains('minus')) return changeQuantity(id, -1);
  if (e.target.classList.contains('remove-item')) return changeQuantity(id, -999);

  if (e.target === cartBtn) return toggleCart(!isCartOpen);
  
  if (!cartDropdown.contains(e.target) && !cartBtn.contains(e.target)) toggleCart(false);
}

// Оформление заказа
function handleCheckout() {
  cart.length ? orderModal.showModal() : alert('Корзина пуста');
}

function handleOrderSubmit(e) {
  e.preventDefault();
  orderModal.close();
  successModal.showModal();
  cart = [];
  updateCart();
  setTimeout(() => successModal.close(), 3000);
}

function init() {
  renderProducts();
  renderCart();
  
  document.addEventListener('click', handleDocumentClick);
  checkoutBtn.addEventListener('click', handleCheckout);
  closeModal.addEventListener('click', () => orderModal.close());
  orderForm.addEventListener('submit', handleOrderSubmit);
}

document.addEventListener('DOMContentLoaded', init);