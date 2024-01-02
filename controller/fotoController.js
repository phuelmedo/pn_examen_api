const Paciente = require('../Paciente');
const path = require('path');

exports.getFotoPaciente = async (req, res) => {
    const pacienteId = req.params.id;
  
    try {
      const paciente = await Paciente.findById(pacienteId);
  
      if (!paciente || !paciente.fotoPersonal) {
        return res.status(404).json({ error: 'Foto no encontrada' });
      }
  
      // Puedes establecer los encabezados adecuados según el tipo de archivo
      res.set('Content-Type', 'image/jpeg');
      
      // Devuelve el archivo al cliente
      res.status(200).sendFile(path.join(__dirname, '..', paciente.fotoPersonal));
    } catch (error) {
      console.error('Error al obtener la foto del paciente:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };