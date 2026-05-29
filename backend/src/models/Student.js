const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  areasInteres: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Area'
  }],
  universidad: {
    type: String,
    required: [true, 'La universidad es obligatoria'],
    maxlength: [200, 'El nombre de la universidad no puede exceder 200 caracteres']
  },
  carrera: {
    type: String,
    required: [true, 'La carrera es obligatoria'],
    maxlength: [200, 'El nombre de la carrera no puede exceder 200 caracteres']
  },
  semestre: {
    type: Number,
    required: [true, 'El semestre es obligatorio'],
    min: [1, 'El semestre debe ser al menos 1'],
    max: [12, 'El semestre no puede exceder 12']
  },
  objetivos: {
    type: String,
    maxlength: [1000, 'Los objetivos no pueden exceder 1000 caracteres']
  },
  mentoriasActivas: {
    type: Number,
    default: 0,
    min: 0
  },
  mentoriasCompletadas: {
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
studentSchema.index({ areasInteres: 1 });
studentSchema.index({ universidad: 1 });

module.exports = mongoose.model('Student', studentSchema);