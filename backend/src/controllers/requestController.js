const MentorshipRequest = require('../models/MentorshipRequest');
const Mentor = require('../models/Mentor');
const Student = require('../models/Student');

// @desc    Obtener todas las solicitudes (filtradas por rol)
// @route   GET /api/requests
// @access  Private
exports.getRequests = async (req, res) => {
  try {
    const { estado, page = 1, limit = 10 } = req.query;
    const filters = {};

    // Filtrar según rol
    if (req.user.rol === 'estudiante') {
      const student = await Student.findOne({ usuarioId: req.user._id });
      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Perfil de estudiante no encontrado'
        });
      }
      filters.estudianteId = student._id;
    } else if (req.user.rol === 'mentora') {
      const mentor = await Mentor.findOne({ usuarioId: req.user._id });
      if (!mentor) {
        return res.status(404).json({
          success: false,
          message: 'Perfil de mentora no encontrado'
        });
      }
      filters.mentoraId = mentor._id;
    }
    // Admin puede ver todas

    if (estado) {
      filters.estado = estado;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const requests = await MentorshipRequest.find(filters)
      .populate({
        path: 'estudianteId',
        populate: {
          path: 'usuarioId',
          select: 'nombre email fotoPerfil'
        }
      })
      .populate({
        path: 'mentoraId',
        populate: {
          path: 'usuarioId',
          select: 'nombre email fotoPerfil'
        }
      })
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ fechaSolicitud: -1 });

    const total = await MentorshipRequest.countDocuments(filters);

    res.json({
      success: true,
      count: requests.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: requests
    });
  } catch (error) {
    console.error('Error obteniendo solicitudes:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// @desc    Obtener solicitud por ID
// @route   GET /api/requests/:id
// @access  Private
exports.getRequestById = async (req, res) => {
  try {
    const request = await MentorshipRequest.findById(req.params.id)
      .populate({
        path: 'estudianteId',
        populate: {
          path: 'usuarioId',
          select: 'nombre email fotoPerfil biografia telefono'
        }
      })
      .populate({
        path: 'mentoraId',
        populate: {
          path: 'usuarioId',
          select: 'nombre email fotoPerfil biografia telefono'
        }
      });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Solicitud no encontrada'
      });
    }

    // Verificar permisos
    const student = await Student.findOne({ usuarioId: req.user._id });
    const mentor = await Mentor.findOne({ usuarioId: req.user._id });
    
    const isStudent = student && request.estudianteId._id.toString() === student._id.toString();
    const isMentor = mentor && request.mentoraId._id.toString() === mentor._id.toString();
    const isAdmin = req.user.rol === 'administrador';

    if (!isStudent && !isMentor && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'No autorizado para ver esta solicitud'
      });
    }

    res.json({
      success: true,
      data: request
    });
  } catch (error) {
    console.error('Error obteniendo solicitud:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// @desc    Crear solicitud de mentoría
// @route   POST /api/requests
// @access  Private (Estudiante)
exports.createRequest = async (req, res) => {
  try {
    const {
  mentoraId,
  mensaje,
  fechaMentoria
} = req.body;

    // Obtener perfil de estudiante
    const student = await Student.findOne({ usuarioId: req.user._id });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Debes completar tu perfil de estudiante primero'
      });
    }

    // Verificar que la mentora existe y está aprobada
    const mentor = await Mentor.findById(mentoraId);
    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: 'Mentora no encontrada'
      });
    }

    if (!mentor.aprobada) {
      return res.status(400).json({
        success: false,
        message: 'La mentora no está aprobada'
      });
    }

    if (!mentor.disponibilidad) {
      return res.status(400).json({
        success: false,
        message: 'La mentora no está disponible actualmente'
      });
    }

    // Verificar si ya existe una solicitud pendiente
    const existingRequest = await MentorshipRequest.findOne({
      estudianteId: student._id,
      mentoraId: mentor._id,
      estado: 'pendiente'
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'Ya tienes una solicitud pendiente con esta mentora'
      });
    }
    const horarioDisponible = mentor.horariosDisponibles.find(
  h =>
    new Date(h.fecha).getTime() ===
    new Date(fechaMentoria).getTime()
);

if (!horarioDisponible) {
  return res.status(400).json({
    success: false,
    message: 'Horario no disponible'
  });
}

    const request = await MentorshipRequest.create({
  estudianteId: student._id,
  mentoraId: mentor._id,
  mensaje,
  fechaMentoria
});

    await request.populate({
      path: 'mentoraId',
      populate: {
        path: 'usuarioId',
        select: 'nombre email fotoPerfil'
      }
    });
    horarioDisponible.disponible = false;

await mentor.save();
    // Incrementar mentorías activas del estudiante
    student.mentoriasActivas += 1;
    await student.save();

    res.status(201).json({
      success: true,
      message: 'Solicitud enviada exitosamente',
      data: request
    });
  } catch (error) {
    console.error('Error creando solicitud:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// @desc    Aceptar solicitud de mentoría
// @route   PUT /api/requests/:id/accept
// @access  Private (Mentora)
exports.acceptRequest = async (req, res) => {
  try {
    const request = await MentorshipRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Solicitud no encontrada'
      });
    }

    // Verificar que sea la mentora destinataria
    const mentor = await Mentor.findOne({ usuarioId: req.user._id });
    if (!mentor || request.mentoraId.toString() !== mentor._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No autorizado para aceptar esta solicitud'
      });
    }

    if (request.estado !== 'pendiente') {
      return res.status(400).json({
        success: false,
        message: 'La solicitud ya fue procesada'
      });
    }

    request.estado = 'aceptada';
    request.fechaRespuesta = Date.now();
    await request.save();

    await request.populate({
      path: 'estudianteId',
      populate: {
        path: 'usuarioId',
        select: 'nombre email'
      }
    });

    res.json({
      success: true,
      message: 'Solicitud aceptada exitosamente',
      data: request
    });
  } catch (error) {
    console.error('Error aceptando solicitud:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// @desc    Rechazar solicitud de mentoría
// @route   PUT /api/requests/:id/reject
// @access  Private (Mentora)
exports.rejectRequest = async (req, res) => {
  try {
    const { motivo } = req.body;
    const request = await MentorshipRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Solicitud no encontrada'
      });
    }

    // Verificar que sea la mentora destinataria
    const mentor = await Mentor.findOne({ usuarioId: req.user._id });
    if (!mentor || request.mentoraId.toString() !== mentor._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No autorizado para rechazar esta solicitud'
      });
    }

    if (request.estado !== 'pendiente') {
      return res.status(400).json({
        success: false,
        message: 'La solicitud ya fue procesada'
      });
    }

    request.estado = 'rechazada';
    request.fechaRespuesta = Date.now();
    request.motivoRechazo = motivo;
    await request.save();

    // Decrementar mentorías activas del estudiante
    const student = await Student.findById(request.estudianteId);
    if (student && student.mentoriasActivas > 0) {
      student.mentoriasActivas -= 1;
      await student.save();
    }

    res.json({
      success: true,
      message: 'Solicitud rechazada',
      data: request
    });
  } catch (error) {
    console.error('Error rechazando solicitud:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// @desc    Completar mentoría
// @route   PUT /api/requests/:id/complete
// @access  Private (Mentora o Estudiante)
exports.completeRequest = async (req, res) => {
  try {
    const request = await MentorshipRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Solicitud no encontrada'
      });
    }

    // Verificar permisos
    const student = await Student.findOne({ usuarioId: req.user._id });
    const mentor = await Mentor.findOne({ usuarioId: req.user._id });
    
    const isStudent = student && request.estudianteId.toString() === student._id.toString();
    const isMentor = mentor && request.mentoraId.toString() === mentor._id.toString();

    if (!isStudent && !isMentor) {
      return res.status(403).json({
        success: false,
        message: 'No autorizado para completar esta mentoría'
      });
    }

    if (request.estado !== 'aceptada') {
      return res.status(400).json({
        success: false,
        message: 'Solo se pueden completar mentorías aceptadas'
      });
    }

    request.estado = 'completada';
    request.fechaCompletada = Date.now();
    await request.save();

    // Actualizar contadores
    const studentDoc = await Student.findById(request.estudianteId);
    const mentorDoc = await Mentor.findById(request.mentoraId);

    if (studentDoc) {
      studentDoc.mentoriasActivas = Math.max(0, studentDoc.mentoriasActivas - 1);
      studentDoc.mentoriasCompletadas += 1;
      await studentDoc.save();
    }

    if (mentorDoc) {
      mentorDoc.totalMentorias += 1;
      await mentorDoc.save();
    }

    res.json({
      success: true,
      message: 'Mentoría completada exitosamente',
      data: request
    });
  } catch (error) {
    console.error('Error completando mentoría:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// @desc    Cancelar solicitud
// @route   DELETE /api/requests/:id
// @access  Private (Estudiante que la creó)
exports.cancelRequest = async (req, res) => {
  try {
    const request = await MentorshipRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Solicitud no encontrada'
      });
    }

    // Verificar que sea el estudiante que la creó
    const student = await Student.findOne({ usuarioId: req.user._id });
    if (!student || request.estudianteId.toString() !== student._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No autorizado para cancelar esta solicitud'
      });
    }

    if (request.estado === 'completada') {
      return res.status(400).json({
        success: false,
        message: 'No se puede cancelar una mentoría completada'
      });
    }

    request.estado = 'cancelada';
    await request.save();

    // Decrementar mentorías activas si aplica
    if (student.mentoriasActivas > 0) {
      student.mentoriasActivas -= 1;
      await student.save();
    }

    res.json({
      success: true,
      message: 'Solicitud cancelada'
    });
  } catch (error) {
    console.error('Error cancelando solicitud:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};