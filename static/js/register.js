const form = document.getElementById('register-form');
const registerBtn = document.getElementById('register-btn');
const successMessage = document.getElementById('success-message');
const errorMessage = document.getElementById('error-message');
const errorText = document.getElementById('error-text');

// ---- Utility: validation helper ----
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

// ---- Password strength checker ----
function checkPasswordStrength(password) {
    const strengthFill = document.getElementById('strength-fill');
    const strengthText = document.getElementById('strength-text');
    const strengthContainer = document.getElementById('password-strength');

    if (password.length === 0) {
        strengthContainer.classList.remove('show');
        return;
    }

    strengthContainer.classList.add('show');

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    strengthFill.className = 'strength-fill';

    if (strength <= 2) {
        strengthFill.classList.add('weak');
        strengthText.textContent = 'Weak password';
    } else if (strength <= 4) {
        strengthFill.classList.add('medium');
        strengthText.textContent = 'Medium strength';
    } else {
        strengthFill.classList.add('strong');
        strengthText.textContent = 'Strong password';
    }
}

// ---- Event listeners for validation ----
document.getElementById('fullName').addEventListener('blur', function() {
    validateField(this, 'fullName-error', v => v.trim().length >= 2, 'Please enter your full name');
});

document.getElementById('email').addEventListener('blur', function() {
    validateField(this, 'email-error', v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'Please enter a valid email address');
});

document.getElementById('username').addEventListener('blur', function() {
    validateField(this, 'username-error', v => v.length >= 3, 'Username must be at least 3 characters long');
});

document.getElementById('password').addEventListener('input', function() {
    checkPasswordStrength(this.value);
});

document.getElementById('password').addEventListener('blur', function() {
    validateField(this, 'password-error', v => v.length >= 8, 'Password must be at least 8 characters long');
});

document.getElementById('confirmPassword').addEventListener('blur', function() {
    const password = document.getElementById('password').value;
    validateField(this, 'confirmPassword-error', v => v === password, 'Passwords do not match');
});

// ---- Form submission ----
form.addEventListener('submit', async function(e) {
    e.preventDefault();

    // Validate all fields
    const fullNameValid = validateField(document.getElementById('fullName'), 'fullName-error', v => v.trim().length >= 2, 'Please enter your full name');
    const emailValid = validateField(document.getElementById('email'), 'email-error', v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'Please enter a valid email address');
    const usernameValid = validateField(document.getElementById('username'), 'username-error', v => v.length >= 3, 'Username must be at least 3 characters long');
    const passwordValid = validateField(document.getElementById('password'), 'password-error', v => v.length >= 8, 'Password must be at least 8 characters long');
    const confirmPasswordValid = validateField(document.getElementById('confirmPassword'), 'confirmPassword-error', v => v === document.getElementById('password').value, 'Passwords do not match');
    const termsAccepted = document.getElementById('terms').checked;

    if (!fullNameValid || !emailValid || !usernameValid || !passwordValid || !confirmPasswordValid || !termsAccepted) {
        if (!termsAccepted) alert('Please accept the Terms of Service and Privacy Policy');
        return;
    }

    // Loading state
    registerBtn.classList.add('loading');
    registerBtn.disabled = true;

    // Payload (drop confirmPassword, keep newsletter + terms)
    const payload = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        username: document.getElementById('username').value,
        password: document.getElementById('password').value,
        confirmPassword: document.getElementById('confirmPassword').value, // still send for server validation
        newsletter: document.getElementById('newsletter').checked,
        terms: termsAccepted
    };

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (data.success) {
            successMessage.classList.add('show');
            form.reset();
            document.getElementById('password-strength').classList.remove('show');

            setTimeout(() => {
                window.location.href = '/login'; // redirect after a pause
            }, 2000);
        } else {
            errorText.textContent = data.error || 'An error occurred during registration.';
            errorMessage.classList.add('show');
        }
    } catch (err) {
        console.error('Registration failed:', err);
        alert('Something went wrong. Please try again later.');
    } finally {
        registerBtn.classList.remove('loading');
        registerBtn.disabled = false;
    }
});

// ---- Mock functions for links ----
function showTerms() { alert('Terms of Service would open here'); }
function showPrivacy() { alert('Privacy Policy would open here'); }
function showLogin() { window.location.href = '/login'; }
