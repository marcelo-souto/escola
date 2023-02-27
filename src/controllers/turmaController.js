const Turma = require('../models/Turma.js')

const anoController = {

    create:async(req,res)=>{

        const {turnoId,anoLetivo} = req.body

        try {

            const turma = await Turma.create({
                turnoId:turnoId,
                anoId:anoLetivo
            })

            return res.status(200).json(`Turma criada com sucesso: ${ano}`)
            
        } catch (erro) {
            return res.json({erro: erro.message})
        }
    },

    
    update:async(req,res)=>{

        const {turmaId,turnoId,anoId} = req.body
        
        try {

            const turma = await Turma.findOne(turmaId)

            const turmaAtt = turma.update({
                turnoId:turnoId,
                anoId:anoId
            })

            return res.status(200).json(`Turma criada com sucesso: ${ano}`)
            
        } catch (erro) {
            return res.json({erro: erro.message})
        }
    },


    getAll:async(req,res)=>{

        try {
        
            const turma = await Turma.findAll()
    
            return res.status(200).json(`${turma}`)

        } catch (erro) {
            return res.json({erro: erro.message})
        }
    },


    delete:async(req,res)=>{
        
        const {id} = req.body

        try {

            const turma = await Turma.findOne(id)
            const turmaDestroy = await Turma.destroy()
    
            return res.status(200).json(`Turma deletada com sucesso: ${turma}`)

        } catch (erro) {
            return res.json({erro: erro.message})
        }
    }
    
}

module.exports = anoController