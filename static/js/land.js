// Mobile menu toggle
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenu.classList.toggle('show');
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
        target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
        });
    }
    });
});

// Scroll animations
function observeElements() {
    const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        }
    });
    }, {
    threshold: 0.1
    });

    document.querySelectorAll('.fade-up').forEach(el => {
    observer.observe(el);
    });
}

// Mock navigation functions
function showLogin() {
    window.location.href = '/login';
}

function showRegister() {
    window.location.href = '/register';
}

function watchDemo() {
    alert("Demo video would play here, but isn't implemented yet.");
}

function showPrivacy() {
    alert('Privacy Policy would open here');
}

function showTerms() {
    alert('Terms of Service would open here');
}

function showContact() {
    alert('Contact page would open here');
}

function showHelp() {
    alert('Help center would open here');
}

// Initialize animations on page load
window.addEventListener('load', () => {
    observeElements();
});

// Close mobile menu on window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
    document.getElementById('mobile-menu').classList.remove('show');
    }
});