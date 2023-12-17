const Paciente = require('./Paciente')
const multer = require('multer')
const { v4: uuidv4 } = require('uuid')
const path = require('path')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    const extension = file.originalname.split('.').pop()
    const filename = `${uuidv4()}.${extension}`
    cb(null, filename)
  },
})

const upload = multer({ storage: storage }).single('fotoPersonal')

exports.getPacientesPorParametros = async (req, res) => {
  try {
    const { id, sexo, fechaIngreso, enfermedad } = req.query
    const query = {}

    if (id) {
      query._id = id
    }

    if (sexo) {
      query.sexo = sexo
    }

    if (fechaIngreso) {
      query.fechaIngreso = { $gte: new Date(fechaIngreso) }
    }

    if (enfermedad) {
      query.enfermedad = enfermedad
    }

    const pacientes = await Paciente.find(query)

    res.status(200).json(pacientes)
  } catch (error) {
    console.error('Error al buscar pacientes:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

exports.addPaciente = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error('Error al cargar la imagen:', err)
      return res.status(500).json({ error: 'Error interno del servidor' })
    }

    const nuevoPaciente = new Paciente(req.body)

    try {
      if (!nuevoPaciente.rut || !nuevoPaciente.nombre || !nuevoPaciente.edad || !nuevoPaciente.sexo || !nuevoPaciente.enfermedad) {
        return res.status(400).json({ error: 'Los campos rut, nombre, edad, sexo y enfermedad son obligatorios' })
      }

      if (req.file) {
        nuevoPaciente.fotoPersonal = `http://localhost:3000/uploads/${req.file.filename}`
      }

      const pacienteGuardado = await nuevoPaciente.save()
      res.status(201).json(pacienteGuardado)
    } catch (error) {
      console.error('Error al agregar un paciente:', error)
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  })
}

exports.updatePacienteById = async (req, res) => {
  upload(req, res, async (err) => {
    const pacienteId = req.params.id
    const datosActualizados = req.body

    try {
      if (!datosActualizados.rut || !datosActualizados.nombre || !datosActualizados.edad || !datosActualizados.sexo || !datosActualizados.enfermedad) {
        return res.status(400).json({ error: 'Los campos rut, nombre, edad, sexo y enfermedad son obligatorios' })
      }

      const pacienteActualizado = await Paciente.findByIdAndUpdate(pacienteId, datosActualizados, {
        new: true,

      })

      if (!pacienteActualizado) {
        return res.status(404).json({ error: 'Paciente no encontrado' })
      }

      res.status(200).json(pacienteActualizado)
    } catch (error) {
      console.error('Error al actualizar el paciente por ID:', error)
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  })


  
}

exports.deletePaciente = async (req, res) => {
  const pacienteId = req.params.id

  try {
    const pacienteEliminado = await Paciente.findByIdAndDelete(pacienteId)
    if (!pacienteEliminado) {
      return res.status(404).json({ error: 'Paciente no encontrado' })
    }

    res.status(200).send()
  } catch (error) {
    console.error('Error al eliminar el paciente por ID:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}
