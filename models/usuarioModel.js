const { neon } = require("@neondatabase/serverless");
const sql = neon(process.env.DATABASE_URL);
const bcrypt = require('bcryptjs');

// Busca um usuário por email. Retorna o objeto usuário ou undefined.
exports.BuscarUsuarioPorEmail = async (email) => {
    // Usar query parametrizada para evitar injeção SQL
    const resultado = await sql.query('SELECT * FROM usuario WHERE email = $1', [email]);
    return resultado && resultado.rows ? resultado.rows[0] : undefined;
};

// Valida credenciais e retorna o usuário (sem senha_hash) ou null
exports.logar = async (email, senha) => {
    // Usar LIMIT 1 compatível com Postgres
    const resultado = await sql.query('SELECT * FROM usuario WHERE email = $1 LIMIT 1', [email]);
    const usuario = resultado && resultado.rows ? resultado.rows[0] : undefined;

    if (!usuario) {
        return null;
    }

    try {
        // bcrypt.compare é a função correta para comparar senha com hash
        const valida = await bcrypt.compare(senha, usuario.senha_hash);

        if (!valida) return null;

        // Não retornar o hash ao chamar o controller
        const usuarioSemHash = { ...usuario };
        delete usuarioSemHash.senha_hash;

        return usuarioSemHash;
    } catch (error) {
        console.error("Erro durante a comparação do hash:", error);
        return null;
    }
};