const loader = document.querySelector(".loader-overlay")
const modalCriarLista = document.querySelector('#dialogCadastrarLista')
const modalCriarConta = document.querySelector('#dialogCadastrarConta')
const modalVerLista = document.querySelector('#dialogLista')
const modalCadastrarItem = document.querySelector('#dialogCadastrarItem')
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
    
    // Event Listeners para botões (As ? garantem que o item exista ou ent não adiciona o evento)
    document.querySelector('#addLista')?.addEventListener('click', () => modalCriarLista.showModal()); // Tem que passar como função para não chamar automaticamente
    document.querySelector('#addConta')?.addEventListener('click', () => modalCriarConta.showModal());
    document.querySelector('.close-button')?.addEventListener('click', () => modalCriarLista.close()); 
    document.querySelector('#dialogCadastrarContaCloseButton')?.addEventListener('click', () => modalCriarConta.close()); 
    document.querySelector('#btnCriarLista')?.addEventListener('click', criarNovaLista)
    document.querySelector('#btnCriarConta')?.addEventListener('click', criarConta)
    document.querySelector('.btn-grupo.btn-secondary')?.addEventListener('click', compartilharGrupo);
    document.querySelector('#addItem')?.addEventListener('click', () => modalCadastrarItem.showModal());
    document.getElementById('dialogCadastrarItemCloseButton')?.addEventListener('click', () => modalCadastrarItem.close());
    document.getElementById('btnCancelarCadastrarItem')?.addEventListener('click', () => modalCadastrarItem.close());
});

async function carregarDados_Contas_Listas() {
    try {   
        const response = await fetch(`/conta/listaContas/${grupoId}`, {
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
        <li class="item" onclick="abrirLista(${lista.lista_id})">
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

        loader.style.display = 'flex';
        const nomeLista = document.querySelector('#nomeLista').value;
        
        const resultado = await fetch('/api/lista/criarLista', {
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

        
        const resultado = await fetch('/api/conta/criarConta/', {
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

async function abrirLista(lista_id) {
    try {
        loader.style.display = 'flex';

        const resposta = await fetch(`/lista/getItems/${lista_id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (resposta.ok || resposta.status == 400) {
            const data = await resposta.json();

            const listaTitulo = document.querySelector('#listaTitulo');
            const itensEl = document.querySelector('#listaItens');
            const totalEl = document.querySelector('#listaTotal');
            const countEl = document.querySelector('#listaCount');
            const modalVerLista = document.querySelector('#dialogLista');

            listaTitulo.textContent = data.resultado?.nome_lista || 'Lista';
        
            const itens = data.resultado || []; // garantindo que sempre vai ser um array para que ele não der erro de nulo caso não tenham itenss
            if (itens.length > 0) {//Verificando se ele já foi comprado para mudadar a classe
                itensEl.innerHTML = itens.map(item => `
                    <li class="lista-item">
                        <label>
                            <input type="checkbox" class="item-checkbox" value="${item.item_lista_id}" ${item.comprado ? 'checked' : ''}> 
                            <span class="${item.comprado ? 'item-comprado' : ''}"> 
                                ${item.nome_item} <small class="item-qtd">x${item.quantidade || 1}</small> 
                            </span>
                        </label>
                        <span class="item-valor">R$ ${Number(item.valor || 0).toFixed(2)}</span>
                    </li>
                `).join('');// Se não tiver uma qtd especidifca é 1
            } else {
                // Exibe um aviso, mas ainda permite abrir o modal
                itensEl.innerHTML = `<li class="sem-item">Nenhum item encontrado. Adicione novos itens abaixo!</li>`;
            }

            // soma total
            let soma = 0;
            itens.forEach(item => {
                const valor = Number(item.valor || item.preco_unitario || 0);
                const quantidade = Number(item.quantidade || 1);
                soma += valor * quantidade;
            });

            totalEl.textContent = soma.toFixed(2);
            countEl.textContent = itens.length;

            // abre o modal mesmo sem itens
            modalVerLista.showModal();

            const closeBtn = document.querySelector('#dialogListaClose');
            closeBtn.onclick = () => modalVerLista.close();

            // adiciona eventos às checkboxes (caso existam)
            setTimeout(() => {
                document.querySelectorAll('.item-checkbox').forEach(chk => {
                    chk.addEventListener('change', async (e) => {
                        const itemId = e.target.value;
                        const comprado = e.target.checked;

                        // exemplo de atualização via PATCH
                        try {
                            await fetch(`/api/lista/${lista_id}/item/${itemId}`, {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ comprado })
                            });
                            const span = e.target.closest('label').querySelector('span');
                            if (comprado) span.classList.add('item-comprado');
                            else span.classList.remove('item-comprado');
                        } catch (err) {
                            console.error('Erro ao atualizar item:', err);
                        }
                    });
                });
            }, 50);

            const btnOpenCadastrarItem = document.querySelector('#btnAddItem');
            btnOpenCadastrarItem.onclick = () => {
                document.querySelector('#item_lista_id').value = lista_id;
                modalCadastrarItem.showModal();
            };
        }

    } catch (error) {
        alert(error);
    } finally {
        loader.style.display = 'none';
    }

}


document.getElementById('formCadastrarItem')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    loader.style.display = 'flex';

    const lista_id = document.getElementById('item_lista_id').value;
    const nome = document.getElementById('nomeItem').value.trim();
    const quantidade = Number(document.getElementById('QuantidadeItem').value) || 1; 
    const categoria_item = document.querySelector('#categoriaItem').value;
    const statusPagamento = document.querySelector('#statusCompraItem').value

    if (!lista_id || !nome) 
    { 
        alert('Selecione a lista e informe o nome do item'); 
        return; 
    }

    loader.style.display = 'flex';
    
    try {
        const res = await fetch(`/api/lista/cadastrarItem`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                lista_id,
                nome_item: nome, 
                quantidade, 
                categoria_item,
                comprado: statusPagamento
            })
        });

        if (res.ok) {
            modalCadastrarItem.close();
            await abrirLista(lista_id);
            await carregarDados_Contas_Listas();
        } else {
            const err = await res.json().catch(()=>({message:'Erro'}));
            alert(err.message || 'Erro ao criar item');
        }
    } catch (err) {
        console.error(err);
        alert('Erro ao criar item');
    } finally {
        loader.style.display = 'none';
    }
});