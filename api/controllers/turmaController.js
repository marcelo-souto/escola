const Turma = require('../models/Turma.js')
const Turno = require("../models/Turnos.js");
const Ano = require('../models/Ano.js');

const anoController = {

    create:async(req,res)=>{

        const {turnoId,anoId,numeroFinal,diretorId: id } = req.body

        try {

            const turno = await Turno.findByPk(turnoId);
            if (!turno) throw new Error("Turno não cadastrado.");

            const ano = await Ano.findByPk(anoId);
            if (!ano) throw new Error("Turno não cadastrado.");
        
            const cod = turnoId* 1000 + anoId * 100 + numeroFinal

            const validTurma = await Turma.findOne({where:{codigo:cod}});
            console.log(validTurma)
            if (validTurma) throw new Error("Turma ja criada.");

            const turma = await Turma.create({
                turnoId:turnoId,
                anoId:anoId,
                numeroFinal:numeroFinal,
                codigo:cod
            })

            return res.status(200).json(`Turma criada com sucesso: ${turma.codigo}`)
            
        } catch (erro) {
            return res.json({erro: erro.message})
        }
    },

    update:async(req,res)=>{

        const {turmaId,turnoId,anoId} = req.body
        
        try {

            const turma = await Turma.findByPk(turmaId)

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