const { neon } = require("@neondatabase/serverless");
const sql = neon(process.env.DATABASE_URL);

// Busca as Listas de um grupo especifico
exports.getListas = async (grupo_id) => {
    const resultado = await sql.query("SELECT lista.*, count(IL.item_lista_id) as quantidade FROM lista LEFT JOIN item_lista IL on lista.lista_id = IL.lista_id where lista.grupo_id = $1 group by lista.lista_id", [grupo_id])

    if(resultado && resultado[0] != null){
        return resultado
    }
    else{
        return null
    }
}

exports.criarLista = async ( grupo_id, nome_lista) => {
    const resultado = await sql.query("INSERT INTO lista(grupo_id, nome_lista, ativa) values($1, $2, $3) RETURNING grupo_id", [grupo_id, nome_lista, 1])

    try{
        if(resultado.length > 0){
                return resultado
        }
        else{
            return JSON.stringify({message: "Erro ao incluir usuarioCriador"}) 
        }
    }
    catch{
        return null
    }
    
}