const { neon } = require("@neondatabase/serverless");
const sql = neon(process.env.DATABASE_URL);
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Busca um usuário por email. 
exports.BuscarUsuarioPorEmail = async (email) => {
    // Não usei `` com injeção $() pq pode ter sql injection
    const resultado = await sql.query('SELECT * FROM usuario WHERE email = $1', [email]);
    return resultado && resultado.rows ? resultado.rows[0] : undefined;
};

exports.logar = async (email, senha) => {
    // LIMIT 1 para trazer apenas um registro
    const resultado = await sql.query('SELECT * FROM usuario WHERE email = $1 LIMIT 1', [email]);
    
    if (resultado.length === 0) {
        // Se não encontrou usuário com o e-mail
        return null;
    }

    try {
        const usuario = resultado[0];
        
        // Valida a senha
        const valida = await bcrypt.compare(senha, usuario.senha_hash);

        if (!valida) return null;

        const token = jwt.sign(
            { id: usuario.usuario_id, email: usuario.email }, //Payload
            process.env.JWT_SECRET,  // Chave JWT Secreta
            { expiresIn: '1h' } // Tempo de Expiração
        );

        return { usuario_id: usuario.usuario_id ,nome: usuario.nome , token: token };
    } catch (error) {
        console.error("Erro durante a comparação do hash:", error);
        return null;
    }
};

exports.cadastrar = async (nome, email, senha) => {
    const senha_hash = await bcrypt.hash(senha, 10)
    const resultado = await sql.query('insert into usuario(nome, email, senha_hash, data_cadastro) values ($1, $2, $3, $4) RETURNING usuario_id', [nome, email, senha_hash, new Date()])
    
    if(resultado != null){
        return resultado
    }
    
    return null;    
}