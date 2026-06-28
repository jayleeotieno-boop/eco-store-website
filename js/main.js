// ============================================================
// DOCUMENT READY
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    initDarkMode();
    initScrollProgress();
    initScrollToTop();
    initProductSearch();
    initProductFilters();
    initCart();
    initBlogFilter();
    initCounters();
    initNewsletterPopup();
    initRatings();
    initWishlist();
    initProductSort();
    initPriceFilter();
    initContactForm();
    initNewsletter();
    initCookieConsent();
    initLightbox();
    initLazyLoading();
    initCheckout();
});

// ============================================================
// DARK MODE
// ============================================================

function initDarkMode() {
    const toggle = document.getElementById('darkModeToggle');
    const body = document.body;

    if (localStorage.getItem('darkMode') === 'enabled') {
        body.classList.add('dark-mode');
        if (toggle) toggle.textContent = '☀️';
    }

    if (toggle) {
        toggle.addEventListener('click', function() {
            body.classList.toggle('dark-mode');
            if (body.classList.contains('dark-mode')) {
                localStorage.setItem('darkMode', 'enabled');
                this.textContent = '☀️';
            } else {
                localStorage.setItem('darkMode', 'disabled');
                this.textContent = '🌙';
            }
        });
    }
}

// ============================================================
// SCROLL PROGRESS
// ============================================================

function initScrollProgress() {
    const bar = document.getElementById('progressBar');
    window.addEventListener('scroll', function() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        if (bar) {
            bar.style.width = progress + '%';
            bar.style.opacity = progress > 0 ? '1' : '0';
        }
    });
}

// ============================================================
// SCROLL TO TOP
// ============================================================

function initScrollToTop() {
    const btn = document.getElementById('scrollTopBtn');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            btn.style.display = 'block';
            btn.style.opacity = '1';
        } else {
            btn.style.opacity = '0';
            setTimeout(() => {
                if (window.scrollY <= 300) btn.style.display = 'none';
            }, 300);
        }
    });
    if (btn) {
        btn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// ============================================================
// PRODUCT SEARCH
// ============================================================

function initProductSearch() {
    const search = document.getElementById('productSearch');
    const products = document.querySelectorAll('.product-item');

    if (search) {
        search.addEventListener('keyup', function() {
            const term = this.value.toLowerCase().trim();
            products.forEach(product => {
                const name = product.querySelector('h5')?.textContent.toLowerCase() || '';
                const desc = product.querySelector('p')?.textContent.toLowerCase() || '';
                if (name.includes(term) || desc.includes(term)) {
                    product.style.display = 'block';
                } else {
                    product.style.display = 'none';
                }
            });
            if (term) addToSearchHistory(term);
        });
    }
}

// ============================================================
// SEARCH HISTORY
// ============================================================

let searchHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');

function addToSearchHistory(term) {
    searchHistory = searchHistory.filter(item => item !== term);
    searchHistory.unshift(term);
    if (searchHistory.length > 10) searchHistory.pop();
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
}

// ============================================================
// PRODUCT FILTERS
// ============================================================

function initProductFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const products = document.querySelectorAll('.product-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const filter = this.dataset.filter;
            const spinner = document.getElementById('loadingSpinner');

            if (spinner) spinner.style.display = 'block';

            setTimeout(() => {
                products.forEach(product => {
                    const cat = product.dataset.cat;
                    if (filter === 'all' || cat === filter) {
                        product.style.display = 'block';
                    } else {
                        product.style.display = 'none';
                    }
                });
                if (spinner) spinner.style.display = 'none';
            }, 300);
        });
    });
}

// ============================================================
// SHOPPING CART
// ============================================================

let cart = [];
const savedCart = localStorage.getItem('ecoCart');
if (savedCart) {
    cart = JSON.parse(savedCart);
}

function initCart() {
    const addButtons = document.querySelectorAll('.add-cart');

    addButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const name = this.dataset.name;
            const price = parseFloat(this.dataset.price);

            const existingItem = cart.find(item => item.name === name);

            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ name: name, price: price, quantity: 1 });
            }

            saveCart();
            renderCart();
            showToast(`${name} added to cart! 🛒`, 'success');
            updateCartToggle();
        });
    });

    const toggle = document.getElementById('cartToggle');
    const sidebar = document.getElementById('cartSidebar');
    const closeBtn = document.getElementById('closeCartBtn');

    if (toggle) {
        toggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            sidebar.classList.remove('open');
        });
    }

    document.addEventListener('click', (e) => {
        if (sidebar && sidebar.classList.contains('open')) {
            if (!sidebar.contains(e.target) && e.target !== toggle) {
                sidebar.classList.remove('open');
            }
        }
    });

    const clearBtn = document.getElementById('clearCartBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            cart = [];
            saveCart();
            renderCart();
            updateCartToggle();
            showToast('Cart cleared!', 'info');
        });
    }

    renderCart();
    updateCartToggle();
}

function saveCart() {
    localStorage.setItem('ecoCart', JSON.stringify(cart));
}

function renderCart() {
    const cartList = document.getElementById('cartItemsList');
    const totalPrice = document.getElementById('cartTotalPrice');

    if (!cartList) return;

    if (cart.length === 0) {
        cartList.innerHTML = '<p class="text-muted text-center">Your cart is empty</p>';
        if (totalPrice) totalPrice.textContent = '$0.00';
        return;
    }

    let html = '';
    let total = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        html += `
            <div class="cart-item">
                <div>
                    <strong>${item.name}</strong>
                    <div class="quantity-controls">
                        <button onclick="updateQuantity(${index}, -1)" class="btn btn-sm btn-outline-secondary">−</button>
                        <span class="mx-2">${item.quantity}</span>
                        <button onclick="updateQuantity(${index}, 1)" class="btn btn-sm btn-outline-secondary">+</button>
                        <button onclick="removeItem(${index})" class="btn btn-sm btn-danger ms-2">×</button>
                    </div>
                </div>
                <div class="text-success">$${itemTotal.toFixed(2)}</div>
            </div>
        `;
    });

    cartList.innerHTML = html;
    if (totalPrice) totalPrice.textContent = `$${total.toFixed(2)}`;
}

function updateQuantity(index, change) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    saveCart();
    renderCart();
    updateCartToggle();
}

function removeItem(index) {
    const itemName = cart[index].name;
    cart.splice(index, 1);
    saveCart();
    renderCart();
    updateCartToggle();
    showToast(`${itemName} removed from cart`, 'info');
}

function updateCartToggle() {
    const badge = document.getElementById('cartCountBadge');
    if (badge) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        badge.textContent = totalItems;
    }
}

// ============================================================
// TOAST NOTIFICATIONS
// ============================================================

function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');

    if (!container) {
        const newContainer = document.createElement('div');
        newContainer.id = 'toastContainer';
        newContainer.className = 'toast-container';
        document.body.appendChild(newContainer);
        return showToast(message, type);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// ============================================================
// BLOG FILTER
// ============================================================

function initBlogFilter() {
    const search = document.getElementById('blogSearch');
    const filter = document.getElementById('blogFilter');
    const posts = document.querySelectorAll('.blog-post');

    function filterBlogPosts() {
        const searchTerm = search ? search.value.toLowerCase().trim() : '';
        const category = filter ? filter.value : 'all';

        posts.forEach(post => {
            const title = post.querySelector('h4')?.textContent.toLowerCase() || '';
            const content = post.querySelector('p')?.textContent.toLowerCase() || '';
            const postCategory = post.dataset.category || 'all';

            const matchesSearch = title.includes(searchTerm) || content.includes(searchTerm);
            const matchesCategory = category === 'all' || postCategory === category;

            if (matchesSearch && matchesCategory) {
                post.style.display = 'block';
            } else {
                post.style.display = 'none';
            }
        });
    }

    if (search) search.addEventListener('keyup', filterBlogPosts);
    if (filter) filter.addEventListener('change', filterBlogPosts);
}

// ============================================================
// ANIMATED COUNTERS
// ============================================================

function initCounters() {
    const counters = document.querySelectorAll('.counter');

    if (counters.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.target);
                const duration = 2000;
                const step = target / (duration / 16);
                let current = 0;

                const updateCounter = () => {
                    current += step;
                    if (current < target) {
                        entry.target.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        entry.target.textContent = target + '+';
                    }
                };

                updateCounter();
                observer.unobserve(entry.target);
            }
        });
    });

    counters.forEach(counter => observer.observe(counter));
}

// ============================================================
// NEWSLETTER POPUP
// ============================================================

function initNewsletterPopup() {
    const popup = document.getElementById('newsletterPopup');

    setTimeout(() => {
        if (popup) popup.style.display = 'flex';
    }, 5000);

    document.addEventListener('click', (e) => {
        if (popup && popup.style.display === 'flex') {
            const content = popup.querySelector('.popup-content');
            if (!content.contains(e.target)) {
                popup.style.display = 'none';
            }
        }
    });

    const form = document.getElementById('popupNewsletterForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('popupEmail');
            if (email && email.value) {
                showToast('✅ Subscribed successfully!', 'success');
                popup.style.display = 'none';
                this.reset();
            }
        });
    }
}

function closeNewsletterPopup() {
    const popup = document.getElementById('newsletterPopup');
    if (popup) popup.style.display = 'none';
}

// ============================================================
// RATING SYSTEM
// ============================================================

function initRatings() {
    const savedRatings = JSON.parse(localStorage.getItem('productRatings') || '{}');
    Object.keys(savedRatings).forEach(productId => {
        const rating = savedRatings[productId];
        updateStars(productId, rating);
    });
}

function setRating(productId, rating) {
    const ratings = JSON.parse(localStorage.getItem('productRatings') || '{}');
    ratings[productId] = rating;
    localStorage.setItem('productRatings', JSON.stringify(ratings));
    updateStars(productId, rating);
    showToast(`⭐ Rated ${rating} stars!`, 'success');
}

function updateStars(productId, rating) {
    const stars = document.querySelectorAll(`.star-${productId}`);
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('text-warning');
            star.classList.remove('text-muted');
        } else {
            star.classList.add('text-muted');
            star.classList.remove('text-warning');
        }
    });
}

// ============================================================
// WISHLIST
// ============================================================

function initWishlist() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        const id = btn.dataset.productId;
        if (wishlist.includes(id)) {
            btn.textContent = '❤️';
            btn.classList.add('text-danger');
        }
    });
}

function toggleWishlist(productId, productName) {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const index = wishlist.indexOf(productId);

    if (index > -1) {
        wishlist.splice(index, 1);
        showToast(`${productName} removed from wishlist`, 'info');
    } else {
        wishlist.push(productId);
        showToast(`${productName} added to wishlist ❤️`, 'success');
    }

    localStorage.setItem('wishlist', JSON.stringify(wishlist));

    const btn = document.querySelector(`.wishlist-btn[data-product-id="${productId}"]`);
    if (btn) {
        if (wishlist.includes(productId)) {
            btn.textContent = '❤️';
            btn.classList.add('text-danger');
        } else {
            btn.textContent = '🤍';
            btn.classList.remove('text-danger');
        }
    }
}

// ============================================================
// PRODUCT SORT
// ============================================================

function initProductSort() {
    const sort = document.getElementById('sortProducts');
    const grid = document.getElementById('productsGrid');

    if (sort) {
        sort.addEventListener('change', function() {
            const products = Array.from(document.querySelectorAll('.product-item'));
            const sortValue = this.value;

            products.sort((a, b) => {
                switch (sortValue) {
                    case 'price-low':
                        return parseInt(a.dataset.price) - parseInt(b.dataset.price);
                    case 'price-high':
                        return parseInt(b.dataset.price) - parseInt(a.dataset.price);
                    case 'name':
                        const nameA = a.querySelector('h5')?.textContent || '';
                        const nameB = b.querySelector('h5')?.textContent || '';
                        return nameA.localeCompare(nameB);
                    default:
                        return 0;
                }
            });

            products.forEach(product => {
                grid.appendChild(product);
            });
        });
    }
}

// ============================================================
// PRICE FILTER
// ============================================================

function initPriceFilter() {
    const range = document.getElementById('priceRange');
    const valueDisplay = document.getElementById('priceValue');

    if (range) {
        range.addEventListener('input', function() {
            const maxPrice = parseInt(this.value);
            if (valueDisplay) valueDisplay.textContent = maxPrice;

            document.querySelectorAll('.product-item').forEach(item => {
                const price = parseInt(item.dataset.price);
                if (price <= maxPrice) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
}

// ============================================================
// SOCIAL MEDIA SHARING
// ============================================================

function shareOnSocial(platform) {
    const url = window.location.href;
    const title = document.querySelector('h1')?.textContent || 'Check this out!';

    const shareUrls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
        whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}`
    };

    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
}

// ============================================================
// CONTACT FORM
// ============================================================

function initContactForm() {
    const form = document.getElementById('contactForm');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            let isValid = true;

            const name = document.getElementById('name');
            const nameError = document.getElementById('nameError');
            if (name && name.value.trim() === '') {
                name.classList.add('is-invalid');
                if (nameError) nameError.textContent = 'Name is required';
                isValid = false;
            } else {
                name.classList.remove('is-invalid');
                name.classList.add('is-valid');
                if (nameError) nameError.textContent = '';
            }

            const email = document.getElementById('email');
            const emailError = document.getElementById('emailError');
            if (email && (email.value.trim() === '' || !email.value.includes('@'))) {
                email.classList.add('is-invalid');
                if (emailError) emailError.textContent = 'Valid email is required';
                isValid = false;
            } else {
                email.classList.remove('is-invalid');
                email.classList.add('is-valid');
                if (emailError) emailError.textContent = '';
            }

            const subject = document.getElementById('subject');
            const subjectError = document.getElementById('subjectError');
            if (subject && subject.value === '') {
                subject.classList.add('is-invalid');
                if (subjectError) subjectError.textContent = 'Please select a subject';
                isValid = false;
            } else {
                subject.classList.remove('is-invalid');
                subject.classList.add('is-valid');
                if (subjectError) subjectError.textContent = '';
            }

            const message = document.getElementById('message');
            const msgError = document.getElementById('msgError');
            if (message && message.value.trim() === '') {
                message.classList.add('is-invalid');
                if (msgError) msgError.textContent = 'Message is required';
                isValid = false;
            } else {
                message.classList.remove('is-invalid');
                message.classList.add('is-valid');
                if (msgError) msgError.textContent = '';
            }

            if (isValid) {
                const success = document.getElementById('formSuccess');
                if (success) {
                    success.textContent = '✅ Message sent successfully!';
                    success.style.color = 'green';
                }
                showToast('✅ Message sent successfully! 📧', 'success');
                this.reset();
                document.querySelectorAll('.is-valid').forEach(el => el.classList.remove('is-valid'));
            }
        });

        document.querySelectorAll('.form-control').forEach(input => {
            input.addEventListener('blur', function() {
                const errorId = this.id + 'Error';
                const error = document.getElementById(errorId);

                if (this.value.trim() === '') {
                    this.classList.add('is-invalid');
                    if (error) error.textContent = 'This field is required';
                } else {
                    this.classList.remove('is-invalid');
                    this.classList.add('is-valid');
                    if (error) error.textContent = '';
                }

                if (this.id === 'email' && this.value.trim() !== '' && !this.value.includes('@')) {
                    this.classList.add('is-invalid');
                    if (error) error.textContent = 'Please enter a valid email';
                }
            });

            input.addEventListener('input', function() {
                if (this.classList.contains('is-invalid') && this.value.trim() !== '') {
                    this.classList.remove('is-invalid');
                    this.classList.add('is-valid');
                    const errorId = this.id + 'Error';
                    const error = document.getElementById(errorId);
                    if (error) error.textContent = '';
                }
            });
        });
    }
}

// ============================================================
// NEWSLETTER
// ============================================================

function initNewsletter() {
    const form = document.getElementById('newsletterForm');
    const message = document.getElementById('newsletterMessage');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('newsletterEmail');

            if (email && email.value.trim() !== '' && email.value.includes('@')) {
                if (message) {
                    message.textContent = '✅ Subscribed successfully!';
                    message.style.color = 'green';
                }
                showToast('✅ Subscribed successfully! 📧', 'success');
                this.reset();
            } else {
                if (message) {
                    message.textContent = '⚠️ Please enter a valid email';
                    message.style.color = 'red';
                }
            }
        });
    }
}

// ============================================================
// COOKIE CONSENT
// ============================================================

function initCookieConsent() {
    if (localStorage.getItem('cookieConsent')) {
        return;
    }

    const banner = document.createElement('div');
    banner.id = 'cookieBanner';
    banner.style.cssText = `
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: #1a1a1a;
        color: white;
        padding: 15px;
        text-align: center;
        z-index: 9999;
    `;

    banner.innerHTML = `
        <p class="mb-0">🍪 We use cookies to improve your experience. 
            <button id="acceptCookies" class="btn btn-success btn-sm">Accept</button>
            <button id="declineCookies" class="btn btn-secondary btn-sm">Decline</button>
        </p>
    `;

    document.body.appendChild(banner);

    document.getElementById('acceptCookies').addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'accepted');
        banner.remove();
        showToast('✅ Cookies accepted!', 'success');
    });

    document.getElementById('declineCookies').addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'declined');
        banner.remove();
    });
}

// ============================================================
// LIGHTBOX GALLERY
// ============================================================

function initLightbox() {
    const images = document.querySelectorAll('.gallery-img, .product-img');

    images.forEach(img => {
        img.addEventListener('click', function() {
            let lightbox = document.getElementById('lightbox');

            if (!lightbox) {
                lightbox = document.createElement('div');
                lightbox.id = 'lightbox';
                lightbox.style.cssText = `
                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.9);
                    z-index: 9999;
                    justify-content: center;
                    align-items: center;
                    cursor: pointer;
                `;

                const img = document.createElement('img');
                img.id = 'lightboxImg';
                img.style.cssText = `
                    max-width: 90%;
                    max-height: 90%;
                    object-fit: contain;
                `;

                lightbox.appendChild(img);
                document.body.appendChild(lightbox);

                lightbox.addEventListener('click', () => {
                    lightbox.style.display = 'none';
                });
            }

            const lightboxImg = document.getElementById('lightboxImg');
            lightboxImg.src = this.src;
            lightbox.style.display = 'flex';
        });
    });
}

// ============================================================
// LAZY LOADING
// ============================================================

function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const images = document.querySelectorAll('img[data-src]');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('fade-in');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => observer.observe(img));
    }
}

// ============================================================
// CHECKOUT
// ============================================================

function initCheckout() {
    const checkoutBtn = document.getElementById('checkoutBtn');

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                showToast('Your cart is empty!', 'error');
                return;
            }

            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            showToast(`🛒 Checkout - Total: $${total.toFixed(2)}`, 'success');

            const sidebar = document.getElementById('cartSidebar');
            if (sidebar) sidebar.classList.remove('open');

            setTimeout(() => {
                showToast('Thank you for your purchase! 🌿', 'success');
                cart = [];
                saveCart();
                renderCart();
                updateCartToggle();
            }, 2000);
        });
    }
}

// ============================================================
// KEYBOARD SHORTCUTS
// ============================================================

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const sidebar = document.getElementById('cartSidebar');
        if (sidebar && sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
        }

        const popup = document.getElementById('newsletterPopup');
        if (popup && popup.style.display === 'flex') {
            popup.style.display = 'none';
        }
    }
});

// ============================================================
// MAKE FUNCTIONS GLOBAL
// ============================================================

window.setRating = setRating;
window.toggleWishlist = toggleWishlist;
window.shareOnSocial = shareOnSocial;
window.updateQuantity = updateQuantity;
window.removeItem = removeItem;
window.closeNewsletterPopup = closeNewsletterPopup;