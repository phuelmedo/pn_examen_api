const express = require('express')
const router = express.Router()
const pacienteController = require('../controller/pacienteController')
const fotoController = require('../controller/fotoController')

router.get('/buscar', pacienteController.getPacientesPorParametros);
router.get('/buscar/:id', pacienteController.getPacientePorId);
router.post('/create', pacienteController.addPaciente)
router.put('/modify/:id', pacienteController.updatePacienteById)
router.delete('/delete/:id', pacienteController.deletePaciente)
router.get('/foto/:id', fotoController.getFotoPaciente);

module.exports = router