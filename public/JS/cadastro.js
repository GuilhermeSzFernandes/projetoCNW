// Validação de confirmação de senha no formulário de cadastro

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.login-form');
    if (!form) return;

    const passwordEl = document.getElementById('password');
    const confirmEl = document.getElementById('confirmPassword');
    const confirmMessage = document.getElementById('confirmMessage');

    function validatePasswords() {
        if (!passwordEl || !confirmEl) return true; // nada a validar

        const pass = passwordEl.value;
        const conf = confirmEl.value;

        if (pass === conf) {
            if (confirmMessage) confirmMessage.style.display = 'none';
            confirmEl.style.borderColor = '';
            return true;
        } else {
            if (confirmMessage) confirmMessage.style.display = 'block';
            confirmEl.style.borderColor = 'crimson';
            return false;
        }
    }

    // Validar ao digitar
    if (passwordEl) passwordEl.addEventListener('input', validatePasswords);
    if (confirmEl) confirmEl.addEventListener('input', validatePasswords);

    // Interceptar submit do form
    form.addEventListener('submit', (e) => {
        if (!validatePasswords()) {
            e.preventDefault();
            // foco no campo de confirmação
            if (confirmEl) confirmEl.focus();
        }
    });
});
