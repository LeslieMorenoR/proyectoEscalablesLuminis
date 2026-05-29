const Area = require('../models/Area');
const Mentor = require('../models/Mentor');

// @desc    Obtener todas las áreas
// @route   GET /api/areas
// @access  Public
exports.getAreas = async (req, res) => {
  try {
    const { activa } = req.query;
    
    const filters = {};
    if (activa !== undefined) {
      filters.activa = activa === 'true';
    }

    const areas = await Area.find(filters).sort({ orden: 1, nombre: 1 });

    res.json({
      success: true,
      count: areas.length,
      data: areas
    });
  } catch (error) {
    console.error('Error obteniendo áreas:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// @desc    Obtener área por ID
// @route   GET /api/areas/:id
// @access  Public
exports.getAreaById = async (req, res) => {
  try {
    const area = await Area.findById(req.params.id);

    if (!area) {
      return res.status(404).json({
        success: false,
        message: 'Área no encontrada'
      });
    }

    // Contar mentoras en esta área
    const mentoras = await Mentor.countDocuments({
      especialidades: area._id,
      aprobada: true
    });

    const areaWithMentors = {
      ...area.toObject(),
      mentoras
    };

    res.json({
      success: true,
      data: areaWithMentors
    });
  } catch (error) {
    console.error('Error obteniendo área:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// @desc    Crear área
// @route   POST /api/areas
// @access  Private (Admin)
exports.createArea = async (req, res) => {
  try {
    const { nombre, descripcion, icono, orden } = req.body;

    // Verificar que no exista
    const areaExists = await Area.findOne({ 
      nombre: new RegExp(`^${nombre}$`, 'i') 
    });

    if (areaExists) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un área con ese nombre'
      });
    }

    const area = await Area.create({
      nombre,
      descripcion,
      icono,
      orden
    });

    res.status(201).json({
      success: true,
      message: 'Área creada exitosamente',
      data: area
    });
  } catch (error) {
    console.error('Error creando área:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// @desc    Actualizar área
// @route   PUT /api/areas/:id
// @access  Private (Admin)
exports.updateArea = async (req, res) => {
  try {
    const area = await Area.findById(req.params.id);

    if (!area) {
      return res.status(404).json({
        success: false,
        message: 'Área no encontrada'
      });
    }

    const { nombre, descripcion, icono, activa, orden } = req.body;

    // Si se cambia el nombre, verificar que no exista
    if (nombre && nombre !== area.nombre) {
      const nombreExists = await Area.findOne({ 
        nombre: new RegExp(`^${nombre}$`, 'i'),
        _id: { $ne: area._id }
      });

      if (nombreExists) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe un área con ese nombre'
        });
      }
      area.nombre = nombre;
    }

    if (descripcion) area.descripcion = descripcion;
    if (icono !== undefined) area.icono = icono;
    if (activa !== undefined) area.activa = activa;
    if (orden !== undefined) area.orden = orden;

    await area.save();

    res.json({
      success: true,
      message: 'Área actualizada exitosamente',
      data: area
    });
  } catch (error) {
    console.error('Error actualizando área:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// @desc    Eliminar área
// @route   DELETE /api/areas/:id
// @access  Private (Admin)
exports.deleteArea = async (req, res) => {
  try {
    const area = await Area.findById(req.params.id);

    if (!area) {
      return res.status(404).json({
        success: false,
        message: 'Área no encontrada'
      });
    }

    // Verificar si hay mentoras con esta especialidad
    const mentorsCount = await Mentor.countDocuments({
      especialidades: area._id
    });

    if (mentorsCount > 0) {
      return res.status(400).json({
        success: false,
        message: `No se puede eliminar. Hay ${mentorsCount} mentoras con esta especialidad`
      });
    }

    await area.deleteOne();

    res.json({
      success: true,
      message: 'Área eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando área:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};