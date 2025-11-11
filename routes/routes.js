// routes/index.js
const express = require('express');
const router = express.Router(); // Cria um novo objeto Router
const baseController = require('../controller/baseController')
const gruposController = require('../controller/gruposController')
const autenticacaoController = require('../controller/autenticacaoController')
const usuarioController = require('../controller/usuarioController')
const listaController = require('../controller/listaController')
const contaController = require('../controller/contaController')
const autenticacaoMidd = require("../middleware/autenticacao");

// --- GET PAGINAS ------------------------

// ValidarToken
router.get("/ValidarToken", autenticacaoMidd, (req, res) => {
    return res.status(200).json({
        mensagem: "Token válido.",
        user: req.user 
    });
});

router.get("/", baseController.index); 

// pagina login
router.get("/login", baseController.loginPage);

// pagina registrar
router.get("/registrar", baseController.registrarPage);

// pagina dashboard
router.get("/dashboard",baseController.dashboardPage);

// Rota para página de perfil
router.get("/perfil", autenticacaoMidd, baseController.perfilPage);

// --- GET ------------------------

// Listar Grupos por usuario_id
router.get("/grupo/listarGrupos/:usuario_id", autenticacaoMidd,gruposController.listarGrupos);

// Carregando dados por grupo
router.get("/grupo/:grupo_id", autenticacaoMidd, gruposController.getGrupo);

// Carregando Listas e Contas por grupo
router.get("/conta/listaContas/:grupo_id", autenticacaoMidd, gruposController.getListasEContas);

// Carregando dados do Usuario
router.get("/usuario/:usuario_id", autenticacaoMidd, usuarioController.getDadosUsuario);

// Carrega dados de uma lista
router.get("/lista/getItems/:lista_id", autenticacaoMidd, listaController.getItems)

// --- POST -----------------------

// Recebe post do formulário de login
router.post('/api/usuario/login', autenticacaoController.login);

// Rota para registrar um usuario
router.post("/api/usuario/registrar", autenticacaoController.cadastrar)

// Altera senha do Usuario
router.post("/api/usuario/alterarSenha", autenticacaoMidd, usuarioController.alterarSenhaUsuario);

// Entra em Grupos por shareCode
router.post("/api/grupo/entrarGrupo", autenticacaoMidd, gruposController.entrarGrupo);

// Cria Grupos 
router.post("/api/grupo/criarGrupo", autenticacaoMidd, gruposController.criarGrupo);

// Cria conta no grupo
router.post("/api/conta/criarConta", autenticacaoMidd, contaController.criarConta) 

// Cria lista no Grupo
router.post("/api/lista/criarLista", autenticacaoMidd, listaController.criarLista)

// Cria um item na lista
router.post("/api/lista/cadastrarItem", autenticacaoMidd, listaController.cadastraItem)

// PATCH -----------------------------

// Patchs não lidam bem com o body, tive que fazer assim. (USei o patch pq é para atualizar propriedads unicas sem prsicsar enviar todo o cortpo, o certo seria objetos, mas não usei pq demora dms)
router.patch('/api/item/:item_id', autenticacaoMidd, listaController.atualizarItem);


module.exports = router;