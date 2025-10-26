// routes/index.js
const express = require('express');
const router = express.Router(); // Cria um novo objeto Router
const baseController = require('../controller/baseController')
const autenticacaoController = require('../controller/autenticacaoController')

// GET 
router.get("/", baseController.index); 

// pagina login
router.get("/login", baseController.loginPage);

// pagina registrar
router.get("/registrar", baseController.registrarPage);

// Recebe post do formulário de login
router.post('/login', autenticacaoController.login);

module.exports = router;