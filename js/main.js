// ============================================================
// DOCUMENT READY - Wait for page to load
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    initDarkMode();
    initScrollProgress();
    initScrollToTop();
});

// ============================================================
// DARK MODE TOGGLE
// ============================================================

function initDarkMode() {
    const toggle = document.getElementById('darkModeToggle');
    const body = document.body;

    // Check saved preference
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
// SCROLL PROGRESS BAR
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
// SCROLL TO TOP BUTTON
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



// ============================================================
// DOCUMENT READY - Wait for page to load
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    initDarkMode();
    initScrollProgress();
    initScrollToTop();
});

// ============================================================
// DARK MODE TOGGLE
// ============================================================

function initDarkMode() {
    const toggle = document.getElementById('darkModeToggle');
    const body = document.body;

    // Check saved preference
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
// SCROLL PROGRESS BAR
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
// SCROLL TO TOP BUTTON
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

            // Add to search history
            if (term) addToSearchHistory(term);
        });
    }
}

// ============================================================
// PRODUCT FILTER BY CATEGORY
// ============================================================

function initProductFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const products = document.querySelectorAll('.product-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const filter = this.dataset.filter;
            const spinner = document.getElementById('loadingSpinner');

            // Show spinner
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

                // Hide spinner
                if (spinner) spinner.style.display = 'none';
            }, 300);
        });
    });
}

// ============================================================
// CALL ALL FUNCTIONS
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    initDarkMode();
    initScrollProgress();
    initScrollToTop();
    initProductSearch();
    initProductFilters();
    // More functions will be added later
});