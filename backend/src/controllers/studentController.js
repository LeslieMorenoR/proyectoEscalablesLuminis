const Student = require('../models/Student');
const User = require('../models/User');
const Area = require('../models/Area');

// @desc    Obtener todos los estudiantes
// @route   GET /api/students
// @access  Private (Admin)
exports.getStudents = async (req, res) => {
  try {
    const { 
      universidad, 
      carrera,
      page = 1,
      limit = 50 
    } = req.query;

    const filters = {};
    
    if (universidad) {
      filters.universidad = { $regex: universidad, $options: 'i' };
    }
    
    if (carrera) {
      filters.carrera = { $regex: carrera, $options: 'i' };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const students = await Student.find(filters)
      .populate('usuarioId', 'nombre email fotoPerfil biografia activo')
      .populate('areasInteres', 'nombre descripcion icono')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Student.countDocuments(filters);

    res.json({
      success: true,
      count: students.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: students
    });
  } catch (error) {
    console.error('Error obteniendo estudiantes:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// @desc    Obtener estudiante por ID
// @route   GET /api/students/:id
// @access  Private
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('usuarioId', 'nombre email fotoPerfil biografia telefono activo')
      .populate('areasInteres', 'nombre descripcion icono');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Estudiante no encontrado'
      });
    }

    res.json({
      success: true,
      data: student
    });
  } catch (error) {
    console.error('Error obteniendo estudiante:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// @desc    Crear perfil de estudiante
// @route   POST /api/students
// @access  Private (Usuario con rol estudiante)
exports.createStudent = async (req, res) => {
  try {
    const {
      areasInteres,
      universidad,
      carrera,
      semestre,
      objetivos
    } = req.body;

    // Verificar que el usuario sea estudiante
    if (req.user.rol !== 'estudiante') {
      return res.status(403).json({
        success: false,
        message: 'Solo usuarios con rol estudiante pueden crear este perfil'
      });
    }

    // Verificar si ya existe perfil de estudiante
    const studentExists = await Student.findOne({ usuarioId: req.user._id });
    if (studentExists) {
      return res.status(400).json({
        success: false,
        message: 'Ya tienes un perfil de estudiante creado'
      });
    }

    // Validar áreas de interés
    if (areasInteres && areasInteres.length > 0) {
      const areasValidas = await Area.countDocuments({
        _id: { $in: areasInteres },
        activa: true
      });

      if (areasValidas !== areasInteres.length) {
        return res.status(400).json({
          success: false,
          message: 'Una o más áreas de interés no son válidas'
        });
      }
    }

    const student = await Student.create({
      usuarioId: req.user._id,
      areasInteres: areasInteres || [],
      universidad: universidad || 'Por completar',
      carrera: carrera || 'Por completar',
      semestre: semestre || 1,
      objetivos: objetivos || ''
    });

    await student.populate('usuarioId', 'nombre email fotoPerfil');
    await student.populate('areasInteres', 'nombre descripcion icono');

    res.status(201).json({
      success: true,
      message: 'Perfil de estudiante creado exitosamente',
      data: student
    });
  } catch (error) {
    console.error('Error creando estudiante:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// @desc    Obtener mi perfil de estudiante
// @route   GET /api/students/me
// @access  Private (Estudiante)
exports.getMyStudentProfile = async (req, res) => {
  try {
    const student = await Student.findOne({ usuarioId: req.user._id })
      .populate('usuarioId', 'nombre email fotoPerfil biografia telefono')
      .populate('areasInteres', 'nombre descripcion icono');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Perfil de estudiante no encontrado'
      });
    }

    res.json({
      success: true,
      data: student
    });
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};

// @desc    Actualizar perfil de estudiante
// @route   PUT /api/students/:id
// @access  Private (Estudiante dueño del perfil o Admin)
exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Estudiante no encontrado'
      });
    }

    // Verificar permisos
    const isOwner = student.usuarioId.toString() === req.user._id.toString();
    const isAdmin = req.user.rol === 'administrador';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'No autorizado para actualizar este perfil'
      });
    }

    const {
      areasInteres,
      universidad,
      carrera,
      semestre,
      objetivos
    } = req.body;

    // Validar áreas de interés si se proporcionan
    if (areasInteres && areasInteres.length > 0) {
      const areasValidas = await Area.countDocuments({
        _id: { $in: areasInteres },
        activa: true
      });

      if (areasValidas !== areasInteres.length) {
        return res.status(400).json({
          success: false,
          message: 'Una o más áreas de interés no son válidas'
        });
      }
      student.areasInteres = areasInteres;
    }

    if (universidad) student.universidad = universidad;
    if (carrera) student.carrera = carrera;
    if (semestre !== undefined) student.semestre = semestre;
    if (objetivos !== undefined) student.objetivos = objetivos;

    await student.save();
    await student.populate('usuarioId', 'nombre email fotoPerfil');
    await student.populate('areasInteres', 'nombre descripcion icono');

    res.json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      data: student
    });
  } catch (error) {
    console.error('Error actualizando estudiante:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: error.message
    });
  }
};