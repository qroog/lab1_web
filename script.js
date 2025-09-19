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