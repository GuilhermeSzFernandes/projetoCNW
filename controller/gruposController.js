const e = require('express');
const model = require('../models/grupoModel');

exports.listarGrupos = async (req, res) => {
    try{
        const {usuario_id} = req.body;

        if(!usuario_id)
            return res.status(400).json({ message: 'ID de Usuario Obrigatorio' });

        const grupos = await model.BuscarGruposPorUsuarioId(usuario_id);

        if(grupos == null)
            return res.status(400).json({ message: 'Nenhum grupo encontrado' });
        else{
            return res.status(200).json({grupos: grupos})
        }
        
    }
    catch(error)
    {
        return res.status(500).json({ message: 'Erro interno do SErvidor'})
    }
}

exports.entrarGrupo = async (req, res) => {
    try{
        const { usuario_id, grupoCodigo} = req.body;

        const entrar = await model.EntrarEmGrupoPorCodigo(usuario_id, grupoCodigo);

        let resultado;

        try {
            resultado = JSON.parse(entrar); 
        } 
        catch (e) {
            // Se a função retornar o objeto do DB o JSON.parse() falha e 'resultado' continua como o objeto 'criar'
            resultado = entrar; 
        }

        if(resultado && resultado.message == null){
            res.status(200).json({message: "Sucesso"})
        }
        else if(resultado.code == 23505){
            res.status(406).json({message: resultado.message})
        }
        else{
            res.status(404).json({message: 'Grupo não encontrado'})
        }
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
}

exports.criarGrupo = async (req,res) => {
    try{
        const {nomeGrupo, tipoGrupo, usuario_id} = req.body;

        if(nomeGrupo && tipoGrupo && usuario_id){

            const criar = await model.criarGrupo(usuario_id, nomeGrupo, tipoGrupo);
            
            let resultado;

            try {
                resultado = JSON.parse(criar); 
            } 
            catch (e) {
                // Se a função retornar o objeto do DB o JSON.parse() falha e 'resultado' continua como o objeto 'criar'
                resultado = criar; 
            }

            if(resultado && resultado.message == null){
                res.status(200).json({message: "Sucesso"})
            }
            else{
                res.status(400).json({erro: resultado.message})
            }
        }
        
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
}