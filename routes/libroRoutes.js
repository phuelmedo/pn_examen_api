const express = require('express')
const router = express.Router()
const libroController = require('../controller/libroController');
const fotoController = require('../controller/fotoController');

router.get('/buscar', libroController.getLibrosPorParametros);
router.get('/buscar/:id', libroController.getLibroPorId);
router.get('/buscar-libros/ultimos', libroController.getUltimosTresLibros);
router.post('/create', libroController.addLibro);
router.put('/modify/:id', libroController.updateLibroById);
router.delete('/delete/:id', libroController.deleteLibro);
router.get('/foto/:id', fotoController.getFotoLibro);

module.exports = router