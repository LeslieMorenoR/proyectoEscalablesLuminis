const Review = require('../models/Review');
const MentorshipRequest = require('../models/MentorshipRequest');
const Mentor = require('../models/Mentor');
const Student = require('../models/Student');

// @desc    Obtener reseñas de una mentora
// @route   GET /api/reviews/mentor/:mentorId
// @access  Public
exports.getReviewsByMentor = async (req, res) => {
  try {
    const { page = 1, limit = 10, visible = 'true' } = req.query;
    
    const filters = { mentoraId: req.params.mentorId };
    if (visible !== undefined) {
      filters.visible = visible === 'true';
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const reviews = await Review.find(filters)
      .populate({
        path: 'estudianteId',
        populate: {
          path: 'usuarioId',
          select: 'nombre fotoPerfil'
        }
      })
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ fechaCreacion: -1 });

    const total = await Review.countDocuments(filters);

    // Calcular estadísticas
    const stats = await Review.aggregate([
      { $match: { mentoraId: req.params.mentorId, visible: true } },
      {
        $group: {
          _id: null,
          promedio: { $avg: '$calificacion' },
          total: { $sum: 1 },
          cinco: { $sum: { $cond: [{ $eq: ['$calificacion', 5] }, 1, 0] } },
          cuatro: { $sum: { $cond: [{ $eq: ['$calificacion', 4] }, 1, 0] } },
          tres: { $sum: { $cond: [{ $eq: ['$calificacion', 3] }, 1, 0] } },
          dos: { $sum: { $cond: [{ $eq: ['$calificacion', 2] }, 1, 0] } },
          uno: { $sum: { $cond: [{ $eq: ['$calificacion', 1] }, 1, 0] } }
        }
      }
    ]);

    res.json({
      success: true,
      count: reviews.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      stats: stats[0] || { promedio: 0, total: 0 },
      data: reviews
    });
  } catch (error) {
    console.error('Error obteniendo reseñas:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// @desc    Obtener reseña por ID
// @route   GET /api/reviews/:id
// @access  Public
exports.getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate({
        path: 'estudianteId',
        populate: {
          path: 'usuarioId',
          select: 'nombre fotoPerfil'
        }
      })
      .populate({
        path: 'mentoraId',
        populate: {
          path: 'usuarioId',
          select: 'nombre fotoPerfil'
        }
      });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Reseña no encontrada'
      });
    }

    res.json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error('Error obteniendo reseña:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// @desc    Crear reseña
// @route   POST /api/reviews
// @access  Private (Estudiante)
exports.createReview = async (req, res) => {
  try {
    const { solicitudId, calificacion, comentario } = req.body;

    // Obtener perfil de estudiante
    const student = await Student.findOne({ usuarioId: req.user._id });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Perfil de estudiante no encontrado'
      });
    }

    // Verificar que la solicitud existe y está completada
    const request = await MentorshipRequest.findById(solicitudId);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Solicitud no encontrada'
      });
    }

    // Verificar que sea el estudiante de la solicitud
    if (request.estudianteId.toString() !== student._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No autorizado para reseñar esta mentoría'
      });
    }

    // Verificar que esté completada
    if (request.estado !== 'completada') {
      return res.status(400).json({
        success: false,
        message: 'Solo se pueden reseñar mentorías completadas'
      });
    }

    // Verificar que no exista ya una reseña
    const existingReview = await Review.findOne({ solicitudId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe una reseña para esta mentoría'
      });
    }

    const review = await Review.create({
      solicitudId,
      estudianteId: student._id,
      mentoraId: request.mentoraId,
      calificacion,
      comentario
    });

    // Actualizar calificación promedio de la mentora
    await updateMentorRating(request.mentoraId);

    await review.populate({
      path: 'estudianteId',
      populate: {
        path: 'usuarioId',
        select: 'nombre fotoPerfil'
      }
    });

    res.status(201).json({
      success: true,
      message: 'Reseña creada exitosamente',
      data: review
    });
  } catch (error) {
    console.error('Error creando reseña:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// @desc    Actualizar reseña
// @route   PUT /api/reviews/:id
// @access  Private (Estudiante dueño de la reseña)
exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Reseña no encontrada'
      });
    }

    // Verificar que sea el estudiante dueño
    const student = await Student.findOne({ usuarioId: req.user._id });
    if (!student || review.estudianteId.toString() !== student._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No autorizado para actualizar esta reseña'
      });
    }

    const { calificacion, comentario } = req.body;

    if (calificacion !== undefined) review.calificacion = calificacion;
    if (comentario) review.comentario = comentario;

    await review.save();

    // Actualizar calificación promedio de la mentora
    await updateMentorRating(review.mentoraId);

    res.json({
      success: true,
      message: 'Reseña actualizada exitosamente',
      data: review
    });
  } catch (error) {
    console.error('Error actualizando reseña:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// @desc    Ocultar/Mostrar reseña (Admin)
// @route   PUT /api/reviews/:id/visibility
// @access  Private (Admin)
exports.toggleVisibility = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Reseña no encontrada'
      });
    }

    review.visible = !review.visible;
    await review.save();

    // Actualizar calificación promedio de la mentora
    await updateMentorRating(review.mentoraId);

    res.json({
      success: true,
      message: `Reseña ${review.visible ? 'visible' : 'oculta'} exitosamente`,
      data: review
    });
  } catch (error) {
    console.error('Error cambiando visibilidad:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// @desc    Eliminar reseña
// @route   DELETE /api/reviews/:id
// @access  Private (Admin o estudiante dueño)
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Reseña no encontrada'
      });
    }

    // Verificar permisos
    const student = await Student.findOne({ usuarioId: req.user._id });
    const isOwner = student && review.estudianteId.toString() === student._id.toString();
    const isAdmin = req.user.rol === 'administrador';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'No autorizado para eliminar esta reseña'
      });
    }

    const mentorId = review.mentoraId;
    await review.deleteOne();

    // Actualizar calificación promedio de la mentora
    await updateMentorRating(mentorId);

    res.json({
      success: true,
      message: 'Reseña eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando reseña:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// Función auxiliar para actualizar calificación de mentora
async function updateMentorRating(mentorId) {
  try {
    const stats = await Review.aggregate([
      { $match: { mentoraId: mentorId, visible: true } },
      {
        $group: {
          _id: null,
          promedio: { $avg: '$calificacion' },
          total: { $sum: 1 }
        }
      }
    ]);

    const mentor = await Mentor.findById(mentorId);
    if (mentor) {
      mentor.calificacionPromedio = stats[0] ? Math.round(stats[0].promedio * 10) / 10 : 0;
      await mentor.save();
    }
  } catch (error) {
    console.error('Error actualizando rating:', error);
  }
}