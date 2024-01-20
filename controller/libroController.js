  const Libro = require('../Libro')
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

  const upload = multer({ storage: storage }).single('portada')
  
  exports.getLibros = async (req, res) => {
    try {
      const libros = await Libro.find();
      res.status(200).json(libros);
    } catch (error) {
      console.error('Error al obtener la lista de libros:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };

  exports.getLibroPorId = async (req, res) => {
    const libroId = req.params.id;
  
    try {
      const libro = await Libro.findById(libroId);
  
      if (!libro) {
        return res.status(404).json({ error: 'Libro no encontrado' });
      }
  
      res.status(200).json(libro);
    } catch (error) {
      console.error('Error al buscar el libro por ID:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };

  exports.addLibro = async (req, res) => {
    upload(req, res, async (err) => {
      if (err) {
        console.error('Error al cargar la imagen de portada:', err);
        return res.status(500).json({ error: 'Error interno del servidor' });
      }
  
      const nuevoLibro = new Libro(req.body);
  
      try {
        if (!nuevoLibro.ISBN || !nuevoLibro.nombreLibro || !nuevoLibro.autor || !nuevoLibro.editorial || !nuevoLibro.paginas) {
          return res.status(400).json({ error: 'Los campos ISBN, nombreLibro, autor, editorial y paginas son obligatorios' });
        }
  
        if (req.file) {
          nuevoLibro.portada = `http://localhost:3001/uploads/${req.file.filename}`;
        }
  
        const libroGuardado = await nuevoLibro.save();
        res.status(201).json(libroGuardado);
      } catch (error) {
        console.error('Error al agregar un libro:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    });
  };


  exports.updateLibroById = async (req, res) => {
    upload(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(500).json({ error: 'Error en la carga de archivos' });
      } else if (err) {
        return res.status(500).json({ error: 'Error en la carga de archivos' });
      }
  
      const libroId = req.params.id;
      const datosActualizados = req.body;
  
      try {
        if (!datosActualizados.ISBN || !datosActualizados.nombreLibro || !datosActualizados.autor || !datosActualizados.editorial || !datosActualizados.paginas) {
          return res.status(400).json({ error: 'Los campos ISBN, nombreLibro, autor, editorial y paginas son obligatorios' });
        }
  
        if (req.file) {
          const nuevaUrlPortada = `http://localhost:3001/uploads/${req.file.filename}`;
          console.log('Nueva URL de la portada:', nuevaUrlPortada);
          datosActualizados['portada'] = nuevaUrlPortada;
        }
  
        const libroActualizado = await Libro.findByIdAndUpdate(libroId, datosActualizados, {
          new: true,
        });
  
        if (!libroActualizado) {
          return res.status(404).json({ error: 'Libro no encontrado' });
        }
  
        if (req.file) {
          libroActualizado.portada = `http://localhost:3001/uploads/${req.file.filename}`;
          await libroActualizado.save();
        }
  
        res.status(200).json(libroActualizado);
      } catch (error) {
        console.error('Error al actualizar el libro por ID:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    });
  };

  exports.deleteLibro = async (req, res) => {
    const libroId = req.params.id;
  
    try {
      const libroEliminado = await Libro.findByIdAndDelete(libroId);
      if (!libroEliminado) {
        return res.status(404).json({ error: 'Libro no encontrado' });
      }
  
      res.status(200).send();
    } catch (error) {
      console.error('Error al eliminar el libro por ID:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };
  
  exports.getLibrosPorParametros = async (req, res) => {
    try {
      const { ISBN, nombreLibro, autor, editorial, paginas } = req.query;
      const query = {};
  
      if (ISBN) {
        query.ISBN = ISBN;
      }
  
      if (nombreLibro) {
        query.nombreLibro = nombreLibro;
      }
  
      if (autor) {
        query.autor = autor;
      }
  
      if (editorial) {
        query.editorial = editorial;
      }
  
      if (paginas) {
        query.paginas = paginas;
      }
  
      const libros = await Libro.find(query);
  
      res.status(200).json(libros);
    } catch (error) {
      console.error('Error al buscar libros por parámetros:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };

  exports.getUltimosTresLibros = async (req, res) => {
    try {
      const libros = await Libro.find()
        .sort({ _id: -1 })
        .limit(3);          
  
      res.status(200).json(libros);
    } catch (error) {
      console.error('Error al obtener los últimos tres libros:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };