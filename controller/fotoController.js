const Libro = require('../Libro');
const path = require('path');

exports.getFotoLibro = async (req, res) => {
    const libroId = req.params.id;
  
    try {
      const libro = await Libro.findById(libroId);
  
      if (!libro || !libro.fotoPersonal) {
        return res.status(404).json({ error: 'Foto no encontrada' });
      }
  
      // Puedes establecer los encabezados adecuados según el tipo de archivo
      res.set('Content-Type', 'image/jpeg');
      
      // Devuelve el archivo al cliente
      res.status(200).sendFile(path.join(__dirname, '..', libro.fotoPersonal));
    } catch (error) {
      console.error('Error al obtener la portada del libro:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };