const User = require('../models/User');
const Student = require('../models/Student');
const Mentor = require('../models/Mentor');

// @desc    Obtener todos los usuarios
// @route   GET /api/users
// @access  Private (Admin)
exports.getUsers = async (req, res) => {
  try {
    const { 
      rol, 
      activo, 
      page = 1, 
      limit = 100 
    } = req.query;

    // Construir filtros
    const filters = {};
    
    if (rol) {
      filters.rol = rol;
    }
    
    if (activo !== undefined) {
      filters.activo = activo === 'true';
    }

    // Paginación
    const skip = (parseInt(page) - 1) * parseInt(limit);

   const users = await User.find(filters)
  .select('-password');

const usersWithMentorData = await Promise.all(
  users.map(async (user) => {

    let mentorProfile = null;

    if (user.rol === 'mentora') {
      mentorProfile = await Mentor.findOne({
        usuarioId: user._id
      });
    }

    return {
      ...user.toObject(),
      mentorProfile
    };
  })
);

    const total = await User.countDocuments(filters);

    res.json({
      success: true,
      count: users.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: usersWithMentorData
    });
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// @desc    Obtener usuario por ID
// @route   GET /api/users/:id
// @access  Private (Admin)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Obtener información adicional según el rol
    let additionalInfo = null;
    
    if (user.rol === 'estudiante') {
      additionalInfo = await Student.findOne({ usuarioId: user._id })
        .populate('areasInteres', 'nombre descripcion');
    } else if (user.rol === 'mentora') {
      additionalInfo = await Mentor.findOne({ usuarioId: user._id })
        .populate('especialidades', 'nombre descripcion');
        
    }

    res.json({
      success: true,
      data: {
        ...user.toJSON(),
        additionalInfo
      }
    });
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// @desc    Actualizar usuario
// @route   PUT /api/users/:id
// @access  Private (Admin)
exports.updateUser = async (req, res) => {
  try {
    const { nombre, email, activo, biografia, telefono } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Actualizar campos permitidos
    if (nombre !== undefined) user.nombre = nombre;
    if (email !== undefined) {
      // Verificar que el email no esté en uso
      const emailExists = await User.findOne({ 
        email, 
        _id: { $ne: user._id } 
      });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'El email ya está en uso'
        });
      }
      user.email = email;
    }
    if (activo !== undefined) user.activo = activo;
    if (biografia !== undefined) user.biografia = biografia;
    if (telefono !== undefined) user.telefono = telefono;

    await user.save();

    res.json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: user.toAuthJSON()
    });
  } catch (error) {
    console.error('Error actualizando usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// @desc    Eliminar usuario
// @route   DELETE /api/users/:id
// @access  Private (Admin)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Eliminar registros relacionados
    if (user.rol === 'estudiante') {
      await Student.deleteOne({ usuarioId: user._id });
    } else if (user.rol === 'mentora') {
      await Mentor.deleteOne({ usuarioId: user._id });
    }

    await user.deleteOne();

    res.json({
      success: true,
      message: 'Usuario eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// @desc    Obtener estadísticas del sistema
// @route   GET /api/users/stats
// @access  Private (Admin)
exports.getStats = async (req, res) => {
  try {
    const totalUsuarios = await User.countDocuments();
    const totalEstudiantes = await User.countDocuments({ rol: 'estudiante' });
    const totalMentoras = await User.countDocuments({ rol: 'mentora' });
    const totalAdmins = await User.countDocuments({ rol: 'administrador' });
    
    const mentorasPendientes = await Mentor.countDocuments({ aprobada: false });
    const mentorasAprobadas = await Mentor.countDocuments({ aprobada: true });

    res.json({
      success: true,
      data: {
        totalUsuarios,
        totalEstudiantes,
        totalMentoras,
        totalAdmins,
        mentorasPendientes,
        mentorasAprobadas
      }
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};