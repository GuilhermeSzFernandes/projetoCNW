const token = localStorage.getItem('token');
const usuario_id = localStorage.getItem('usuario_id');
const nomeUsuario = localStorage.getItem('nomeUsuario');
var loader = document.querySelector('.loader-overlay');

if(!token)
    window.location.href = '/';

async function carregarDados(){
    loader.style.display = 'flex';
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

    if(listaGrupos.length > 0){ 
        let htmlContent = '';
        listaGrupos.forEach(grupo => {
            htmlContent += `<a href="/grupo/${grupo.grupo_id}" class="sub-card">${grupo.nome_grupo || 'Grupo Sem Nome'}</a>`;
        });
        groupList.innerHTML = htmlContent;

    }
    
    groupList.innerHTML += `<a id="btnAddGrupoModal" class="sub-card">Adicionar Grupos</a>`

    const btnAdd = document.getElementById("btnAddGrupoModal")
    const btnClose = document.getElementById("btnCloseModal")
    const modalEntrar = document.querySelector("#dialogShareCode")

    if(btnAdd){

        btnAdd.onclick = () => {
            modalEntrar.showModal();
        }
    }

    if(btnClose){
        btnClose.onclick = () => {
            modalEntrar.close();
        }
    }
    loader.style.display = 'none';
}

carregarDados();
// Pegando todos os inputs OTP
const otpInputs = document.querySelectorAll(".otp-input")
let otpValue = ""

function getOTPValue() {
    let value = ""
    otpInputs.forEach((input) => {
        value += input.value
    })
    return value
}

// Adicionando eventos para cada input
otpInputs.forEach((input, index) => {
// Evento de t (quando digita
    input.addEventListener("input", (e) => {
        const value = e.target.value

        // Permite apenas números
        if (!/^\d*$/.test(value)) {
            e.target.value = ""
            return
        }
        
        // Atualiza o valor global
        otpValue = getOTPValue()

        // Move para o próximo input se digitou um número
        if (value && index < otpInputs.length - 1) {
            otpInputs[index + 1].focus()
        }

    })

    input.addEventListener("keydown", (e) => {
        // Volta para o input anterior
        if (e.key === "Backspace" && !input.value && index > 0) {
            if (input.value) {
                // Se tem valor apaga
                input.value = ""
                getOTPValue()
            } else if (index > 0) {
                // Se não tem valor volta para o anterior e apaga ele
                otpInputs[index - 1].focus()
                otpInputs[index - 1].value = ""
                getOTPValue()
            }
            e.preventDefault()
        }

        //Move para o input anterior
        if (e.key === "ArrowLeft" && index > 0) {
            otpInputs[index - 1].focus()
        }

        // Seta direita: move para o próximo input
        if (e.key === "ArrowRight" && index < otpInputs.length - 1) {
            otpInputs[index + 1].focus()
        }
    })
    
    
})




const btnEntrarGrupoModal = document.querySelector("#btnEntarGrupoModal");
btnEntrarGrupoModal.onclick = entrarGrupo;

const btnCriarGrupo = document.querySelector("#btnCriarGrupo");
btnCriarGrupo.onclick = cadastrarGrupo;

const entrarGrupoLinkModal = document.querySelector("#entrarGrupoLinkModal")
entrarGrupoLinkModal.onclick = () => {
    const modalEntrar = document.querySelector("#dialogShareCode")
    const modalCadastro = document.querySelector("#dialogCadastrarGrupo")
    
    tipoGrupo.value = "";
    nomeGrupo.value = "";

    modalCadastro.close();
    modalEntrar.showModal();
}

const criarGrupoLinkModal = document.querySelector("#criarGrupoLinkModal")
criarGrupoLinkModal.onclick = () => {
    const modalEntrar = document.querySelector("#dialogShareCode")
    const modalCadastro = document.querySelector("#dialogCadastrarGrupo")
    
    otpInputs.forEach((input) => {
        input.value = "";
    })

    modalEntrar.close();
    modalCadastro.showModal();
}





async function entrarGrupo(){
    loader.style.display = 'flex';
    if(otpValue.trim() != null && otpValue.length == 6 ){
        const grupoCodigo = otpValue;

        const resposta = await fetch('/entrarGrupo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${token}`
            },
            body: JSON.stringify({
                usuario_id,
                grupoCodigo
            })
        })

        if(resposta.status == 200){
            otpInputs.forEach((input) => {
                input.value = "";
            })

            const modalEntrar = document.querySelector("#dialogShareCode")
            modalEntrar.close();
            
            carregarDados();
        }
        else if(resposta.status == 406){
            otpInputs.forEach((input) => {
                input.value = "";
            })

            alert("Você já está neste grupo!")
        }
        else if(resposta.status == 404){
            otpInputs.forEach((input) => {
                input.value = "";
            })

            alert("Codigo Invalido!")
        }
    }
    loader.style.display = 'none';
}


async function cadastrarGrupo(){
    loader.style.display = 'flex';
    const nomeGrupo = document.querySelector("#nomeGrupo").value;
    const tipoGrupo = document.querySelector("#tipoGrupo").value;

    const resposta = await fetch('/criarGrupo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `bearer ${token}`
        },
        body: JSON.stringify({
            nomeGrupo,
            tipoGrupo,
            usuario_id
        })
    })

    if(resposta.status == 200){
        const modalCadastro = document.querySelector("#dialogCadastrarGrupo")
        modalCadastro.close();
        
        carregarDados();
    }
    loader.style.display = 'none';
}