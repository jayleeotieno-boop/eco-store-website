// Dark Mode Toggle
const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;

// Check saved preference
if (localStorage.getItem('darkMode') === 'enabled') {
    body.classList.add('dark-mode');
    if (darkModeToggle) darkModeToggle.textContent = '☀️ Light Mode';
}

if (darkModeToggle) {
    darkModeToggle.addEventListener('click', function() {
        body.classList.toggle('dark-mode');
        
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('darkMode', 'enabled');
            this.textContent = '☀️ Light Mode';
        } else {
            localStorage.setItem('darkMode', 'disabled');
            this.textContent = '🌙 Dark Mode';
        }
    });
}

// Loading Spinner
function showLoading() {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) spinner.style.display = 'block';
}

function hideLoading() {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) spinner.style.display = 'none';
}

// Show spinner when filtering products
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        showLoading();
        setTimeout(() => {
            // Filter logic here
            hideLoading();
        }, 500);
    });
});

// Scroll to Top Button
const scrollBtn = document.getElementById('scrollTopBtn');

window.addEventListener('scroll', function() {
    if (window.scrollY > 300) {
        scrollBtn.style.display = 'block';
        scrollBtn.style.opacity = '1';
    } else {
        scrollBtn.style.opacity = '0';
        setTimeout(() => {
            if (window.scrollY <= 300) scrollBtn.style.display = 'none';
        }, 300);
    }
});

if (scrollBtn) {
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Product Search
const searchInput = document.getElementById('productSearch');
const productItems = document.querySelectorAll('.product-item');

if (searchInput) {
    searchInput.addEventListener('keyup', function() {
        const searchTerm = this.value.toLowerCase().trim();
        
        productItems.forEach(item => {
            const productName = item.querySelector('h5')?.textContent.toLowerCase() || '';
            const productDesc = item.querySelector('p')?.textContent.toLowerCase() || '';
            
            if (productName.includes(searchTerm) || productDesc.includes(searchTerm)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
}

// Cart Sidebar Toggle
const cartToggle = document.getElementById('cartToggle');
const cartSidebar = document.getElementById('cartSidebar');
const closeCartBtn = document.getElementById('closeCartBtn');

if (cartToggle) {
    cartToggle.addEventListener('click', () => {
        cartSidebar.classList.toggle('open');
    });
}

if (closeCartBtn) {
    closeCartBtn.addEventListener('click', () => {
        cartSidebar.classList.remove('open');
    });
}

// Close cart when clicking outside
document.addEventListener('click', (e) => {
    if (cartSidebar && cartSidebar.classList.contains('open')) {
        if (!cartSidebar.contains(e.target) && e.target !== cartToggle) {
            cartSidebar.classList.remove('open');
        }
    }
});

// Update cart display with quantity controls
function renderCart() {
    const cartItemsList = document.getElementById('cartItemsList');
    const cartTotalPrice = document.getElementById('cartTotalPrice');
    const cartCountBadge = document.getElementById('cartCountBadge');
    
    if (!cartItemsList) return;
    
    if (cart.length === 0) {
        cartItemsList.innerHTML = '<p class="text-muted text-center">Cart is empty</p>';
        if (cartTotalPrice) cartTotalPrice.textContent = '$0.00';
        if (cartCountBadge) cartCountBadge.textContent = '0';
        return;
    }
    
    let html = '';
    let total = 0;
    let itemCount = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        itemCount += item.quantity;
        
        html += `
            <div class="cart-item">
                <div>
                    <strong>${item.name}</strong>
                    <div class="quantity-controls">
                        <button onclick="updateQuantity(${index}, -1)" class="btn btn-sm btn-outline-secondary">-</button>
                        <span class="mx-2">${item.quantity}</span>
                        <button onclick="updateQuantity(${index}, 1)" class="btn btn-sm btn-outline-secondary">+</button>
                        <button onclick="removeItem(${index})" class="btn btn-sm btn-danger ms-2">×</button>
                    </div>
                </div>
                <div class="text-success">$${itemTotal.toFixed(2)}</div>
            </div>
        `;
    });
    
    cartItemsList.innerHTML = html;
    if (cartTotalPrice) cartTotalPrice.textContent = `$${total.toFixed(2)}`;
    if (cartCountBadge) cartCountBadge.textContent = itemCount;
    
    // Save to localStorage
    localStorage.setItem('ecoCart', JSON.stringify(cart));
}

// Update quantity
function updateQuantity(index, change) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    renderCart();
}

// Remove item
function removeItem(index) {
    cart.splice(index, 1);
    renderCart();
}

// Clear cart
function clearCart() {
    cart = [];
    renderCart();
    if (cartSidebar) cartSidebar.classList.remove('open');
}

// Toast Notification System
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer') || createToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    container.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
}

// Replace alerts with toasts
// In add to cart function:
showToast(`${productName} added to cart! 🛒`, 'success');

// In clear cart function:
showToast('Cart cleared!', 'info');

// In form validation:
showToast('Message sent successfully! 📧', 'success');
showToast('Please fill all fields', 'error');

// Animated Counters
function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + '+';
            }
        };
        
        updateCounter();
    });
}

// Trigger when element is in view
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            observer.unobserve(entry.target);
        }
    });
});

const statsSection = document.querySelector('.stats-section');
if (statsSection) {
    observer.observe(statsSection);
}