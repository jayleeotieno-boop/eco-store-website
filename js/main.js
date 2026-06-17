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
            this.textContent = ' Light Mode';
        } else {
            localStorage.setItem('darkMode', 'disabled');
            this.textContent = ' Dark Mode';
        }
    });

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
}

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