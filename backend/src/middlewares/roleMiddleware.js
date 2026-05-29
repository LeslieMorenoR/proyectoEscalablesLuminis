// Middleware para autorizar roles específicos
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado',
      });
    }

    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({
        success: false,
        message: `El rol '${req.user.rol}' no tiene permisos para esta acción`,
      });
    }

    next();
  };
};

// Middleware específico para administradores
exports.adminOnly = (req, res, next) => {
  if (!req.user || req.user.rol !== 'administrador') {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. Se requiere rol de administrador',
    });
  }
  next();
};

// Middleware para mentoras
exports.mentorOnly = (req, res, next) => {
  if (!req.user || req.user.rol !== 'mentora') {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. Se requiere rol de mentora',
    });
  }
  next();
};

// Middleware para estudiantes
exports.studentOnly = (req, res, next) => {
  if (!req.user || req.user.rol !== 'estudiante') {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. Se requiere rol de estudiante',
    });
  }
  next();
};