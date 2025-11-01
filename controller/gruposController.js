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
