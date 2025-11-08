// routes/index.js
const express = require('express');
const router = express.Router(); // Cria um novo objeto Router
const baseController = require('../controller/baseController')
const gruposController = require('../controller/gruposController')
const autenticacaoController = require('../controller/autenticacaoController')
const usuarioController = require('../controller/usuarioController')
const autenticacaoMidd = require("../middleware/autenticacao");

// --- GET ------------------------

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

// Listar Grupos por usuario_id
router.get("/listarGrupos/:usuario_id", autenticacaoMidd,gruposController.listarGrupos);

// Carregando dados por grupo
router.get("/grupo/:grupo_id", autenticacaoMidd, gruposController.getGrupo);

// Carregando Listas e Contas por grupo
router.get("/listaContas/:grupo_id", autenticacaoMidd, gruposController.getListasEContas);

// Carregando dados do Usuario
router.get("/usuario/:usuario_id", autenticacaoMidd, usuarioController.getDadosUsuario);

// --- POST -----------------------

// Recebe post do formulário de login
router.post('/api/login', autenticacaoController.login);

// Rota para registrar um usuario
router.post("/api/registrar", autenticacaoController.cadastrar)

// Entra em Grupos por shareCode
router.post("/api/entrarGrupo", autenticacaoMidd, gruposController.entrarGrupo);

// Cria Grupos 
router.post("/api/criarGrupo", autenticacaoMidd, gruposController.criarGrupo);

// Altera senha do Usuario
router.post("/api/alterarSenha", autenticacaoMidd, usuarioController.alterarSenhaUsuario);

// Cria lista no Grupo
router.post("/api/criarLista", autenticacaoMidd, gruposController.criarLista)

// Cria conta no grupo
router.post("/api/criarConta", autenticacaoMidd, gruposController.criarConta)

module.exports = router;