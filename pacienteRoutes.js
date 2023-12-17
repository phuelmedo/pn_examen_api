const express = require('express')
const router = express.Router()
const pacienteController = require('./pacienteController')

router.get('/buscar', pacienteController.getPacientesPorParametros);
router.post('/create', pacienteController.addPaciente)
router.put('/modify/:id', pacienteController.updatePacienteById)
router.delete('/delete/:id', pacienteController.deletePaciente)

module.exports = router