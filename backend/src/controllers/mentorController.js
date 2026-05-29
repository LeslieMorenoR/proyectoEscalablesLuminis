const Mentor = require('../models/Mentor');
const User = require('../models/User');
const Area = require('../models/Area');

// @desc    Obtener todas las mentoras aprobadas
// @route   GET /api/mentors
// @access  Public
exports.getMentors = async (req, res) => {
  try {
    const { 
      especialidad, 
      experienciaMin, 
      disponibilidad, 
      calificacionMin,
      page = 1,
      limit = 10 
    } = req.query;

    // Construir filtros
    const filters = { aprobada: true };
    
    if (especialidad) {
      filters.especialidades = especialidad;
    }
    
    if (experienciaMin) {
      filters.experiencia = { $gte: parseInt(experienciaMin) };
    }
    
    if (disponibilidad !== undefined) {
      filters.disponibilidad = disponibilidad === 'true';
    }
    
    if (calificacionMin) {
      filters.calificacionPromedio = { $gte: parseFloat(calificacionMin) };
    }

    // Paginación
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const mentors = await Mentor.find(filters)
      .populate('usuarioId', 'nombre email fotoPerfil biografia')
      .populate('especialidades', 'nombre descripcion icono')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ calificacionPromedio: -1, totalMentorias: -1 });

    const total = await Mentor.countDocuments(filters);

    res.json({
      success: true,
      count: mentors.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: mentors
    });
  } catch (error) {
    console.error('Error obteniendo mentoras:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// @desc    Obtener mentora por ID
// @route   GET /api/mentors/:id
// @access  Public
exports.getMentorById = async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id)
      .populate('usuarioId', 'nombre email fotoPerfil biografia telefono')
      .populate('especialidades', 'nombre descripcion icono');

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: 'Mentora no encontrada'
      });
    }

    res.json({
      success: true,
      data: mentor
    });
  } catch (error) {
    console.error('Error obteniendo mentora:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// @desc    Crear perfil de mentora
// @route   POST /api/mentors
// @access  Private (Usuario con rol mentora)
exports.createMentor = async (req, res) => {
  try {
    const {
      especialidades,
      experiencia,
      educacion,
      empresa,
      puesto,
      linkedIn
    } = req.body;

    // Verificar que el usuario sea mentora
    if (req.user.rol !== 'mentora') {
      return res.status(403).json({
        success: false,
        message: 'Solo usuarios con rol mentora pueden crear este perfil'
      });
    }

    // Verificar si ya existe perfil de mentora
    const mentorExists = await Mentor.findOne({ usuarioId: req.user._id });
    if (mentorExists) {
      return res.status(400).json({
        success: false,
        message: 'Ya tienes un perfil de mentora creado'
      });
    }

    // Validar especialidades
    if (especialidades && especialidades.length > 0) {
      const areasValidas = await Area.countDocuments({
        _id: { $in: especialidades },
        activa: true
      });

      if (areasValidas !== especialidades.length) {
        return res.status(400).json({
          success: false,
          message: 'Una o más áreas de especialización no son válidas'
        });
      }
    }

    const mentor = await Mentor.create({
      usuarioId: req.user._id,
      especialidades: especialidades || [],
      experiencia,
      educacion,
      empresa,
      puesto,
      linkedIn,
      aprobada: false // Requiere aprobación de admin
    });

    await mentor.populate('usuarioId', 'nombre email fotoPerfil');
    await mentor.populate('especialidades', 'nombre descripcion icono');

    res.status(201).json({
      success: true,
      message: 'Perfil de mentora creado. Pendiente de aprobación.',
      data: mentor
    });
  } catch (error) {
    console.error('Error creando mentora:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};
exports.getMyMentorProfile = async (req, res) => {

  try {

    const mentor = await Mentor.findOne({
      usuarioId: req.user._id
    })
    .populate('usuarioId', 'nombre email fotoPerfil biografia telefono ')
    .populate('especialidades', 'nombre descripcion icono');

    if (!mentor) {

      return res.status(404).json({
        success: false,
        message: 'No existe perfil de mentora para este usuario'
      });

    }

    res.json({
      success: true,
      data: mentor
    });

  } catch (error) {

    console.error('ERROR GET PROFILE:', error);

    res.status(500).json({
      success: false,
      message: 'Error del servidor',
      error: error.message
    });

  }

};
// @desc    Actualizar perfil de mentora
// @route   PUT /api/mentors/:id
// @access  Private (Mentora dueña del perfil)
// @desc    Actualizar perfil de mentora
// @route   PUT /api/mentors/:id
// @access  Private (Mentora dueña del perfil)

exports.updateMentor = async (req, res) => {

  try {

    const mentor = await Mentor.findById(req.params.id);

    if (!mentor) {

      return res.status(404).json({
        success: false,
        message: 'Mentora no encontrada'
      });

    }

    // Verificar propietaria

    if (
      mentor.usuarioId.toString() !==
      req.user._id.toString()
    ) {

      return res.status(403).json({
        success: false,
        message: 'No autorizado'
      });

    }

    const {
      especialidades,
      experiencia,
      educacion,
      empresa,
      puesto,
      linkedIn,
      disponibilidad,
      horariosDisponibles
    } = req.body;

    // VALIDAR ÁREAS

    if (
      especialidades &&
      especialidades.length > 0
    ) {

      const areasValidas =
        await Area.countDocuments({

          _id: {
            $in: especialidades
          },

          activa: true

        });

      if (
        areasValidas !==
        especialidades.length
      ) {

        return res.status(400).json({

          success: false,

          message:
            'Una o más áreas no son válidas'

        });

      }

      mentor.especialidades =
        especialidades;

    }

    // CAMPOS

    if (experiencia !== undefined) {
      mentor.experiencia = experiencia;
    }

    if (educacion !== undefined) {
      mentor.educacion = educacion;
    }

    if (empresa !== undefined) {
      mentor.empresa = empresa;
    }

    if (puesto !== undefined) {
      mentor.puesto = puesto;
    }

    if (linkedIn !== undefined) {
      mentor.linkedIn = linkedIn;
    }

    if (disponibilidad !== undefined) {
      mentor.disponibilidad = disponibilidad;
    }

    /* 🔥 GUARDAR HORARIOS */

    if (
  horariosDisponibles &&
  Array.isArray(horariosDisponibles)
) {

  mentor.horariosDisponibles =
    horariosDisponibles.map(fecha => ({

      fecha,

      disponible: true

    }));

}

    await mentor.save();

    await mentor.populate(
      'usuarioId',
      'nombre email fotoPerfil'
    );

    await mentor.populate(
      'especialidades',
      'nombre descripcion icono'
    );

    res.json({

      success: true,

      message:
        'Perfil actualizado exitosamente',

      data: mentor

    });

  } catch (error) {

    console.error(
      'Error actualizando mentora:',
      error
    );

    res.status(500).json({

      success: false,

      message: 'Error en el servidor',

      error: error.message

    });

  }

};

// @desc    Aprobar mentora (Admin)
// @route   PUT /api/mentors/:id/approve
// @access  Private (Admin)
exports.approveMentor = async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id);

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: 'Mentora no encontrada'
      });
    }

    mentor.aprobada = true;
    mentor.fechaAprobacion = Date.now();
    mentor.motivoRechazo = undefined;

    await mentor.save();

    res.json({
      success: true,
      message: 'Mentora aprobada exitosamente',
      data: mentor
    });
  } catch (error) {
    console.error('Error aprobando mentora:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// @desc    Rechazar mentora (Admin)
// @route   PUT /api/mentors/:id/reject
// @access  Private (Admin)
exports.rejectMentor = async (req, res) => {
  try {
    const { motivo } = req.body;

    const mentor = await Mentor.findById(req.params.id);

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: 'Mentora no encontrada'
      });
    }

    mentor.aprobada = false;
    mentor.motivoRechazo = motivo;

    await mentor.save();

    res.json({
      success: true,
      message: 'Mentora rechazada',
      data: mentor
    });
  } catch (error) {
    console.error('Error rechazando mentora:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// @desc    Eliminar mentora
// @route   DELETE /api/mentors/:id
// @access  Private (Admin o dueña del perfil)
exports.deleteMentor = async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id);

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: 'Mentora no encontrada'
      });
    }

    // Verificar permisos
    const isOwner = mentor.usuarioId.toString() === req.user._id.toString();
    const isAdmin = req.user.rol === 'administrador';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'No autorizado para eliminar este perfil'
      });
    }

    await mentor.deleteOne();

    res.json({
      success: true,
      message: 'Perfil de mentora eliminado'
    });
  } catch (error) {
    console.error('Error eliminando mentora:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};