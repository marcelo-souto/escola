const Ano = require('../models/Ano.js');

const anoController = {

    create:async(req,res)=>{

        const {anoLetivo} = req.body

        try {

            const ano = await Ano.create({
            anoLetivo:anoLetivo,})
            
            return res.status(200).json(`Ano criada com sucesso: ${ano}`)
            
        } catch (erro) {
            return res.json({erro: erro.message})
        }
    },


    update:async(req,res)=>{

        const {id,anoLetivo} = req.body

        try {

            const ano = await Ano.findByPk(id,{include:Turno})

            const anoAtt = await ano.update({
                anoLetivo:anoLetivo
            })
            
            return res.status(200).json(`Ano criada com sucesso: ${ano}`)
            
        } catch (erro) {
            return res.json({erro: erro.message})
        }
    },


    getAll:async(req,res)=>{

        try {
        
            const ano = await Ano.findAll()
    
            return res.status(200).json(ano)

        } catch (erro) {
            return res.json({erro: erro.message})
        }
    },


    delete:async(req,res)=>{
        
        const {id} = req.body

        try {

            const ano = await Ano.findOne(id)
            const anoDestroy = await ano.destroy()
    
            return res.status(200).json(`Ano deletado com sucesso: ${ano}`)

        } catch (erro) {
            return res.json({erro: erro.message})
        }
    }
    
}

module.exports = anoController