const validaToken = async () => {
    const res = await fetch('/ValidarToken',  {
        method: 'GET'
    })

    if(res.status != 200){
        liProfile.style.display = "none"
        liHome.style.display = "none"
        liLogin.style.display = "block"

        window.location.href = "/"
    }
    else{
        liProfile.style.display = "block";
        liLogin.style.display = "none";
    }
}


document.addEventListener('DOMContentLoaded', function() {
    //Valida o token
    validaToken();
    
    // Carregar dados do grupo
    carregarDadosGrupo();

    // Event Listeners para botões
    document.querySelector('.btn-grupo.btn-primary:nth-child(1)').addEventListener('click', criarNovaLista);
    document.querySelector('.btn-grupo.btn-primary:nth-child(2)').addEventListener('click', criarNovaConta);
    document.querySelector('.btn-grupo.btn-secondary').addEventListener('click', compartilharGrupo);
});

async function carregarDadosGrupo() {
    try {
        const grupoId = new URLSearchParams(window.location.search).get('id');
        const response = await fetch(`/api/grupos/${grupoId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (response.ok) {
            const dados = await response.json();
            atualizarInterface(dados);
        }
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
    }
}

function atualizarInterface(dados) {
    // Atualiza nome do grupo
    document.querySelector('.grupo-info h1').textContent = dados.nome;
    document.querySelector('.grupo-code').textContent = `Código de compartilhamento: ${dados.codigo}`;

    // Atualiza listas
    const listaContainer = document.querySelector('.lista-items');
    listaContainer.innerHTML = dados.listas.map(lista => `
        <li class="item">
            <span>${lista.nome}</span>
            <span>${lista.quantidade} items</span>
        </li>
    `).join('');

    // Atualiza contas
    const contasContainer = document.querySelector('.contas-items');
    contasContainer.innerHTML = dados.contas.map(conta => `
        <li class="item">
            <div>
                <span class="item-status status-${conta.status}"></span>
                <span>${conta.descricao}</span>
            </div>
            <span>R$ ${conta.valor.toFixed(2)}</span>
        </li>
    `).join('');
}

function criarNovaLista() {
    // Implementar lógica para criar nova lista
}

function criarNovaConta() {
    // Implementar lógica para criar nova conta
}

function compartilharGrupo() {
    const codigo = document.querySelector('.grupo-code').textContent.split(': ')[1];
    navigator.clipboard.writeText(codigo).then(() => alert('Código copiado para a área de transferência!')).catch(err => console.error('Erro ao copiar código:', err));
}