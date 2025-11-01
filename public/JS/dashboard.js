const token = localStorage.getItem('token');
const usuario_id = localStorage.getItem('usuario_id');
const nomeUsuario = localStorage.getItem('nomeUsuario');



async function carregarDados(){
    
    // Carregando Nome
    const nomeWelcome = document.getElementById('nomeUsuario');
    nomeWelcome.textContent = nomeUsuario;


    // Carregando Grupos
    const resposta = await fetch('/listarGrupos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `bearer ${token}`
        },
        body: JSON.stringify({
            usuario_id
        })
    })

    const data = await resposta.json()
    const listaGrupos = data.grupos;
    const groupList = document.getElementById('gruposList');

    if(listaGrupos.length > 1){ 
        let htmlContent = '';
        listaGrupos.forEach(grupo => {
            htmlContent += `<a href="/grupo/${grupo.id}" class="group-card">${grupo.nome || 'Grupo Sem Nome'}</a>`;
        });
        groupList.innerHTML = htmlContent;

    } else {
        groupList.innerHTML = `<a href="#" class="sub-card">Adicionar Grupos</a>`
    }  
}

carregarDados();