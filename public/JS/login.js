async function logar(event) {
	if (event && event.preventDefault) event.preventDefault();

	const emailEl = document.getElementById('email');
	const senhaEl = document.getElementById('senha');

	const email = emailEl ? emailEl.value.trim() : '';
	const senha = senhaEl ? senhaEl.value : '';

	if (!email || !senha) {
		alert('Preencha e-mail e senha');
		return;
	}

	try {
		const res = await fetch('/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password: senha })
		});

		const data = await res.json();

		if (res.ok) {
			alert(data.message || 'Login bem sucedido');
		} else {
			alert(data.message || 'Falha no login');
		}
	} catch (err) {
		console.error('Erro ao enviar login:', err);
		alert('Erro ao conectar com o servidor');
	}
}

const form = document.querySelector('.login-form');
if (form) {
	form.addEventListener('submit', logar);
} else {
	const btnEnviar = document.getElementById('btnLogin');
	if (btnEnviar) btnEnviar.addEventListener('click', logar);
}