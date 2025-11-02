// routes/index.js
const express = require('express');
const router = express.Router(); // Cria um novo objeto Router
const baseController = require('../controller/baseController')
const gruposController = require('../controller/gruposController')
const autenticacaoController = require('../controller/autenticacaoController')

// --- GET ------------------------

router.get("/", baseController.index); 

// pagina login
router.get("/login", baseController.loginPage);

// pagina registrar
router.get("/registrar", baseController.registrarPage);

// pagina dashboard
router.get("/dashboard", baseController.dashboardPage);

// Listar Grupos por usuario_id
router.get("/listarGrupos/:usuario_id", gruposController.listarGrupos);

// --- POST -----------------------

// Recebe post do formulário de login
router.post('/login', autenticacaoController.login);

// Rota para registrar um usuario
router.post("/registrar", autenticacaoController.cadastrar)

// Entra em Grupos por shareCode
router.post("/entrarGrupo", gruposController.entrarGrupo);

// Cria Grupos 
router.post("/criarGrupo", gruposController.criarGrupo);

module.exports = router;