const products = [
  { id: 1, name: "Moza R3", price: 24990, description: "FFB Руль", image: "Images/Moza_R3.WebP" },
  { id: 2, name: "Moza R5", price: 39990, description: "FFB Руль", image: "Images/Moza_R5.WebP" },
  { id: 3, name: "Moza R12", price: 45990, description: "FFB база", image: "Images/Moza_R12.WebP" },
  { id: 4, name: "Simagic Sequential Shifter", price: 20990, description: "Секвентальный шифтер", image: "Images/Q1S.WebP" },
  { id: 5, name: "Simagic GT1-D Wheel", price: 31990, description: "Рулевое колесо", image: "Images/Wheel.WebP" },
  { id: 6, name: "Simagic P1000 Hydraulic Pedals", price: 57990, description: "Педали с обратной связью", image: "Images/Pedals.WebP" }
];

// DOM-элементы
const productsContainer = document.getElementById('products-container');

// Формат цены
const formatPrice = p => new Intl.NumberFormat('ru-RU').format(p) + ' ₽';

// Рендер товаров
function renderProducts() {
  productsContainer.innerHTML = products.map(p => `
    <div class="product-card">
      <div class="product-image">Изображение ${p.name}</div>
      <div class="product-info">
        <h3 class="product-title">${p.name}</h3>
        <p class="product-description">${p.description}</p>
        <div class="product-price">${formatPrice(p.price)}</div>
        <button class="add-to-cart" data-id="${p.id}">Добавить в корзину</button>
      </div>
    </div>
  `).join('');
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
});

// Состояние
let cart = [];
let isCartOpen = false;

// DOM-элементы
const cartDropdown = document.getElementById('cart-dropdown');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.getElementById('cart-count');
const cartBtn = document.getElementById('cart-btn');

// Переключение корзины
function toggleCart(open) {
  cartDropdown.classList.toggle('active', open);
  cartBtn.setAttribute('aria-expanded', open);
  isCartOpen = open;
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

  cartItems.innerHTML = cart.length
    ? cart.map(i => `
        <div class="cart-item">
          <div class="cart-item-info">
            <div class="cart-item-title">${i.name}</div>
            <div class="cart-item-price">${formatPrice(i.price)}</div>
          </div>
          <div class="cart-item-quantity">
            <button class="quantity-btn minus" data-id="${i.id}">-</button>
            <span>${i.quantity}</span>
            <button class="quantity-btn plus" data-id="${i.id}">+</button>
          </div>
          <button class="remove-item" data-id="${i.id}">×</button>
        </div>
      `).join('')
    : '<div class="empty-cart">Ваша корзина пуста</div>';

  cartTotal.textContent = formatPrice(cart.reduce((s, i) => s + i.price * i.quantity, 0));
}

// Добавление товара
function addToCart(id) {
  const item = cart.find(i => i.id === id);
  item ? item.quantity++ : cart.push({ ...products.find(p => p.id === id), quantity: 1 });
  renderCart();
  toggleCart(true);
}

// Изменение количества
function changeQuantity(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) cart = cart.filter(i => i.id !== id);
  renderCart();
}

// Клик
document.addEventListener('click', e => {
  const id = +e.target.dataset.id;

  if (e.target.classList.contains('add-to-cart')) return addToCart(id);
  if (e.target.classList.contains('plus')) return changeQuantity(id, 1);
  if (e.target.classList.contains('minus')) return changeQuantity(id, -1);
  if (e.target.classList.contains('remove-item')) return changeQuantity(id, -999);

  if (e.target === cartBtn) return toggleCart(!isCartOpen);
});