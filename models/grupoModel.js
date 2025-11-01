const { neon } = require("@neondatabase/serverless");
const sql = neon(process.env.DATABASE_URL);
const bcrypt = require('bcryptjs');
const { DATETIME } = require("mysql/lib/protocol/constants/types");

exports.BuscarGruposPorUsuarioId = async (usuario_id) => {
    const resultado = await sql.query('SELECT grupo_id from grupo_membro where usuario_id = $1', [usuario_id])

    if(resultado == null)
        return null

    return resultado;
}