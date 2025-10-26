const model = require('../models/usuarioModel');

exports.login = async (req, res) => {
    const { email, password, senha } = req.body;
    const senhaRecebida = password || senha;

    if (!email || !senhaRecebida) {
        return res.status(400).json({ message: 'E-mail e senha são obrigatórios' });
    }

    try {
        const usuario = await model.logar(email, senhaRecebida);

        if (usuario) {
            return res.status(200).json({ success: true, message: 'Autenticado', usuario });
        } else {
            return res.status(401).json({ success: false, message: 'Credenciais inválidas' });
        }
    } catch (error) {
        console.error('Erro no login:', error);
        return res.status(500).json({ message: 'Erro interno do servidor' });
    }
};