const Turno = require('../models/Turnos.js')

const anoController = {

    create:async(req,res)=>{

        const {periodo} = req.body

        try {

            const turno = await Turno.create({periodo:periodo})
            
            return res.status(200).json(`Ano criada com sucesso: ${turno}`)
            
        } catch (erro) {
            return res.json({erro: erro.message})
        }
    },


    update:async(req,res)=>{

        const {id,periodo} = req.body

        try {

            const turno = await Turno.findByPk(id)

            const turnoAtt = await turno.update({
                periodo:periodo
            })
            
            return res.status(200).json(`Turno criada com sucesso: ${turno}`)
            
        } catch (erro) {
            return res.json({erro: erro.message})
        }
    },


    getAll:async(req,res)=>{

        try {
        
            const turno = await Turno.findAll()
    
            return res.status(200).json(`${turno}`)

        } catch (erro) {
            return res.json({erro: erro.message})
        }
    },


    delete:async(req,res)=>{
        
        const {id} = req.body

        try {

            const turno = await Turno.findOne(id)
            const turnoDestroy = turno.destroy()
    
            return res.status(200).json(`Ano deletado com sucesso: ${turno}`)

        } catch (erro) {
            return res.json({erro: erro.message})
        }
    }
    
}

module.exports = anoController