const loader = document.querySelector(".loader-overlay")
const modalCriarLista = document.querySelector('#dialogCadastrarLista')
const modalCriarConta = document.querySelector('#dialogCadastrarConta')
const grupoId = window.location.pathname.split('/').pop(); 

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
    carregarDados_Contas_Listas();
    
    // Event Listeners para botões
    document.querySelector('#addLista').addEventListener('click', () => modalCriarLista.showModal()); // Tem que passar como função para não chamar automaticamente
    document.querySelector('#addConta').addEventListener('click', () => modalCriarConta.showModal());
    document.querySelector('.close-button').addEventListener('click', () => modalCriarLista.close()); 
    document.querySelector('#dialogCadastrarContaCloseButton').addEventListener('click', () => modalCriarConta.close()); 
    document.querySelector('#btnCriarLista').addEventListener('click', criarNovaLista)
    document.querySelector('#btnCriarConta').addEventListener('click', criarConta)
    document.querySelector('.btn-grupo.btn-secondary').addEventListener('click', compartilharGrupo);
});

async function carregarDados_Contas_Listas() {
    try {   
        const response = await fetch(`/listaContas/${grupoId}`, {
            method: 'GET'
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
    // Atualiza listas
    const listaContainer = document.querySelector('.lista-items');
    if (dados.listas && dados.listas.length > 0) {
        listaContainer.innerHTML = dados.listas.map(lista => `
            <li class="item">
            <span>${lista.nome_lista}</span>
            <span>${lista.quantidade} items</span>
        </li>
    `).join('');
    } 
    else {
        listaContainer.innerHTML = `<div class="sem-item">Nenhuma lista encontrada</div>`;
    }

    // Atualiza contas
    const contasContainer = document.querySelector('.contas-items');
    if (dados.contas && dados.contas.length > 0) {
        contasContainer.innerHTML = dados.contas.map(conta => `
        <li class="item">
            <div>
                <span class="item-status status-${conta.status}"></span>
                <span>${conta.descricao}</span>
            </div>
            <span>R$ ${Number(conta.valor_total).toFixed(2)}</span>
        </li>
    `).join('');
    } 
    else {
        contasContainer.innerHTML = `<div class="sem-item">Nenhuma conta encontrada</div>`;
    }
}

async function criarNovaLista(event) {
    if (event) event.preventDefault();
    try{

        loader.style.display = 'block';
        const nomeLista = document.querySelector('#nomeLista').value;
        
        const resultado = await fetch('/api/criarLista', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                grupo_id: grupoId,
                nome_lista: nomeLista
            })
        })

        if(resultado.status == 200){
            modalCriarLista.close();
            carregarDados_Contas_Listas();
        }
        else{
            alert('Campos Obrigatorios');
            modalCriarLista.close();
        }
        
        loader.style.display = 'none';
    }
    catch{
        loader.style.display = 'none';
    }
}

async function criarConta() {
    const nomeConta = document.querySelector('#nomeConta').value
    const descricaoConta = document.querySelector('#descricaoConta').value
    const valorConta = document.querySelector('#valorConta').value
    const dataVencimento = document.querySelector('#dataVencimento').value
    const dataPagamento = document.querySelector('#dataPagamento').value
    const statusPagamento = document.querySelector('#statusPagamento').value
    const categoriaConta = document.querySelector('#categoriaConta').value

    try{

        
        const resultado = await fetch('/api/criarConta/', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                grupo_id: grupoId,
                nome: nomeConta,
            descricao: descricaoConta,
            valor_total: valorConta,
            data_vencimento: dataVencimento,
            data_pagamento: dataPagamento,
            paga: statusPagamento,
            categoria_conta: categoriaConta 
        })})
    
        if(resultado.status == 200){
            modalCriarConta.close();
            carregarDados_Contas_Listas();
        }
        else{
            alert('Campos Obrigatorios');
            modalCriarConta.close();
        }
        
        loader.style.display = 'none';

    }
    catch{
        loader.style.display = 'none';
    }
}

function criarNovaConta() {
    // Implementar lógica para criar nova conta
}

function compartilharGrupo() {
    const codigo = document.querySelector('.grupo-code').texContastContent.split(': ')[1];
    navigator.clipboard.writeText(codigo).then(() => alert('Código copiado para a área de transferência!')).catch(err => console.error('Erro ao copiar código:', err));
}