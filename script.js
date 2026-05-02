// State
let cart = [];
let wishlist = [];

// ─── Smooth Scroll & Scroll Spy ────────────────────────────────────────────
// Enable smooth scrolling on all anchor links and close mobile menu
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('navLinks').classList.remove('active');
  });
});

// Scroll spy: highlight the nav link whose section is currently in view
const sections = document.querySelectorAll('main section');
const navLinks = document.querySelectorAll('.nav-links a');

function updateActiveNav() {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateActiveNav);
updateActiveNav();

// ─── Mobile Menu ─────────────────────────────────────────────────────────────
function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('active');
}

// ─── Product Data ─────────────────────────────────────────────────────────────
const products = [
  {
    id: 1,
    title: "Pastel Floral Summer Dress",
    category: "dress",
    price: 45.99,
    image: "assets/dress1.png"
  },
  {
    id: 2,
    title: "Pink Crop Top",
    category: "top",
    price: 24.99,
    image: "assets/top1.png"
  },
  {
    id: 3,
    title: "Peach Ethnic Lehenga",
    category: "ethnic",
    price: 89.99,
    image: "assets/ethnic1.png"
  },
  {
    id: 4,
    title: "Lavender Party Dress",
    category: "dress",
    price: 59.99,
    image: "assets/dress2.png"
  }
];

// ─── Render Products ──────────────────────────────────────────────────────────
function renderProducts(filter = 'all') {
  const grid = document.getElementById('productsGrid');
  grid.innerHTML = '';

  const filteredProducts = filter === 'all' ? products : products.filter(p => p.category === filter);

  filteredProducts.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';

    const inWishlist = wishlist.some(item => item.id === product.id);
    const heartIcon = inWishlist ? 'fas fa-heart' : 'far fa-heart';
    const heartStyle = inWishlist ? 'style="color: #e09ebd;"' : '';

    card.innerHTML = `
      <div class="product-img-container">
        <img src="${product.image}" alt="${product.title}" class="product-img">
        <div class="product-actions">
          <button class="action-btn" onclick="toggleWishlistItem(${product.id})" ${heartStyle}>
            <i class="${heartIcon}"></i>
          </button>
          <button class="action-btn" onclick="addToCart(${product.id})">
            <i class="fas fa-shopping-cart"></i>
          </button>
        </div>
      </div>
      <div class="product-info">
        <div class="product-category">${product.category}</div>
        <h3 class="product-title">${product.title}</h3>
        <div class="product-price">$${product.price.toFixed(2)}</div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// ─── Filter Logic ─────────────────────────────────────────────────────────────
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    renderProducts(e.target.getAttribute('data-filter'));
  });
});

// ─── Cart Functions ───────────────────────────────────────────────────────────
function toggleCart() {
  const sidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('overlay');
  sidebar.classList.toggle('active');
  overlay.classList.toggle('active');
  if (sidebar.classList.contains('active')) {
    document.getElementById('wishlistSidebar').classList.remove('active');
  }
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  updateCart();
  showToast(`${product.title} added to cart!`);
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  updateCart();
}

function updateCart() {
  const content = document.getElementById('cartContent');
  const count = document.getElementById('cartCount');
  const totalEl = document.getElementById('cartTotal');

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  count.innerText = totalItems;

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  totalEl.innerText = `$${total.toFixed(2)}`;

  if (cart.length === 0) {
    content.innerHTML = '<div class="empty-state">Your cart is empty</div>';
    return;
  }

  content.innerHTML = '';
  cart.forEach(item => {
    content.innerHTML += `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.title}" class="item-img">
        <div class="item-details">
          <div class="item-title">${item.title}</div>
          <div class="item-price">$${item.price.toFixed(2)} x ${item.quantity}</div>
        </div>
        <button class="remove-item" onclick="removeFromCart(${item.id})">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;
  });
}

function checkout() {
  if (cart.length === 0) {
    showToast("Your cart is empty!");
    return;
  }
  showToast("Redirecting to secure checkout...");
  cart = [];
  updateCart();
  toggleCart();
}

// ─── Wishlist Functions ───────────────────────────────────────────────────────
function toggleWishlist() {
  const sidebar = document.getElementById('wishlistSidebar');
  const overlay = document.getElementById('overlay');
  sidebar.classList.toggle('active');
  overlay.classList.toggle('active');
  if (sidebar.classList.contains('active')) {
    document.getElementById('cartSidebar').classList.remove('active');
  }
}

function toggleWishlistItem(id) {
  const existingIndex = wishlist.findIndex(item => item.id === id);
  const product = products.find(p => p.id === id);

  if (existingIndex >= 0) {
    wishlist.splice(existingIndex, 1);
  } else {
    wishlist.push(product);
    showToast(`${product.title} added to wishlist!`);
  }

  updateWishlist();

  const currentFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
  renderProducts(currentFilter);
}

function updateWishlist() {
  const content = document.getElementById('wishlistContent');
  const count = document.getElementById('wishlistCount');

  count.innerText = wishlist.length;

  if (wishlist.length === 0) {
    content.innerHTML = '<div class="empty-state">Your wishlist is empty</div>';
    return;
  }

  content.innerHTML = '';
  wishlist.forEach(item => {
    content.innerHTML += `
      <div class="wishlist-item">
        <img src="${item.image}" alt="${item.title}" class="item-img">
        <div class="item-details">
          <div class="item-title">${item.title}</div>
          <div class="item-price">$${item.price.toFixed(2)}</div>
        </div>
        <button class="remove-item" onclick="toggleWishlistItem(${item.id})">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;
  });
}

// ─── Close sidebars on overlay click ─────────────────────────────────────────
function closeSidebars() {
  document.getElementById('cartSidebar').classList.remove('active');
  document.getElementById('wishlistSidebar').classList.remove('active');
  document.getElementById('overlay').classList.remove('active');
}

// ─── Toast Notification ───────────────────────────────────────────────────────
function showToast(message) {
  const existing = document.getElementById('toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'toast';
  toast.innerText = message;
  toast.style.cssText = `
    position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%);
    background: #333; color: #fff; padding: 0.8rem 1.8rem;
    border-radius: 30px; font-size: 0.95rem; z-index: 9999;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    animation: fadeIn 0.3s ease;
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ─── Initialize ───────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  updateCart();
  updateWishlist();
});
