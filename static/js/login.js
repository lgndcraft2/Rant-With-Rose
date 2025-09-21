const form = document.getElementById('login-form');
const loginBtn = document.getElementById('login-btn');
const successMessage = document.getElementById('success-message');

// Form validation
function validateField(field, errorId, validationFn, errorMessage) {
    const errorDiv = document.getElementById(errorId);
    const isValid = validationFn(field.value);

    if (isValid) {
        field.classList.remove('error');
        errorDiv.classList.remove('show');
    } else {
        field.classList.add('error');
        errorDiv.textContent = errorMessage;
        errorDiv.classList.add('show');
    }

    return isValid;
}

// Event listeners for validation
document.getElementById('email').addEventListener('blur', function() {
    validateField(this, 'email-error', value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), 'Please enter a valid email address');
});

document.getElementById('password').addEventListener('blur', function() {
    validateField(this, 'password-error', value => value.length > 0, 'Please enter your password');
});

// ---- Updated form submission with fetch ----
form.addEventListener('submit', async function(e) {
    e.preventDefault();

    // Validate fields
    const passwordValid = validateField(document.getElementById('password'), 'password-error', value => value.length > 0, 'Please enter your password');

    if (!passwordValid) return;

    // Show loading state
    loginBtn.classList.add('loading');
    loginBtn.disabled = true;

    // Prepare payload
    const payload = {
        username: document.getElementById('email').value,
        password: document.getElementById('password').value,
        remember: document.getElementById('remember').checked
    };

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        });
        console.log(payload + " I am the payload")
        const data = await response.json();

        if (response.ok) {
            successMessage.classList.add('show');

            setTimeout(() => {
                // Redirect to dashboard or chat
                window.location.href = '/chat-ui'; // adjust as needed
            }, 2000);
        } else {
            // Display backend errors
            if (data.errors) {
                Object.keys(data.errors).forEach(key => {
                    const errorEl = document.getElementById(`${key}-error`);
                    if (errorEl) {
                        errorEl.textContent = data.errors[key];
                        errorEl.classList.add('show');
                    }
                });
            } else if (data.message) {
                alert(data.message);
            }
        }
    } catch (error) {
        console.error('Login failed:', error);
        alert('Something went wrong. Please try again later.');
    } finally {
        loginBtn.classList.remove('loading');
        loginBtn.disabled = false;
    }
});

// Mock functions for social login and navigation
function showForgotPassword() { alert('Forgot password page would open here'); }
function showRegister() { window.location.href = '/register'; } // redirect to register

// Auto-focus email field
window.addEventListener('load', () => { document.getElementById('email').focus(); });
