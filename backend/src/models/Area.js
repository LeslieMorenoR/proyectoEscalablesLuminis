const mongoose = require('mongoose');

const areaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del área es obligatorio'],
    unique: true,
    trim: true,
    maxlength: [100, 'El nombre no puede exceder 100 caracteres']
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
    maxlength: [500, 'La descripción no puede exceder 500 caracteres']
  },
  icono: {
    type: String,
    default: 'default-icon.png'
  },
  activa: {
    type: Boolean,
    default: true
  },
  orden: {
    type: Number,
    default: 0
  },
  mentoras: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices
areaSchema.index({ activa: 1, orden: 1 });
areaSchema.index({ nombre: 1 });

module.exports = mongoose.model('Area', areaSchema);