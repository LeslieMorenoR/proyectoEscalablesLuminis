const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true,
    maxlength: [100, 'El nombre no puede exceder 100 caracteres']
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido'],
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
    select: false, // No se devuelve por defecto
  },
  rol: {
    type: String,
    enum: ['visitante', 'estudiante', 'mentora', 'administrador'],
    default: 'estudiante',
  },
  fotoPerfil: {
    type: String,
    default: 'default-avatar.png',
  },
  biografia: {
    type: String,
    maxlength: [500, 'La biografía no puede exceder 500 caracteres'],
  },
  telefono: {
    type: String,
    match: [/^[0-9]{10}$/, 'Teléfono inválido (10 dígitos)'],
  },
  activo: {
    type: Boolean,
    default: true,
  },
  fechaRegistro: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Encriptar contraseña antes de guardar
userSchema.pre('save', async function (next) {
  // Solo hashear si la contraseña fue modificada
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar contraseñas
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Método para obtener datos públicos del usuario
userSchema.methods.toAuthJSON = function() {
  return {
    _id: this._id,
    nombre: this.nombre,
    email: this.email,
    rol: this.rol,
    fotoPerfil: this.fotoPerfil,
    biografia: this.biografia,
    telefono: this.telefono,
    activo: this.activo,
    fechaRegistro: this.fechaRegistro
  };
};

module.exports = mongoose.model('User', userSchema);