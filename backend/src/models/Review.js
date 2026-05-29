const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  solicitudId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MentorshipRequest',
    required: true,
    unique: true
  },
  estudianteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  mentoraId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mentor',
    required: true
  },
  calificacion: {
    type: Number,
    required: [true, 'La calificación es obligatoria'],
    min: [1, 'La calificación mínima es 1'],
    max: [5, 'La calificación máxima es 5']
  },
  comentario: {
    type: String,
    required: [true, 'El comentario es obligatorio'],
    minlength: [10, 'El comentario debe tener al menos 10 caracteres'],
    maxlength: [1000, 'El comentario no puede exceder 1000 caracteres']
  },
  visible: {
    type: Boolean,
    default: true
  },
  reportada: {
    type: Boolean,
    default: false
  },
  motivoReporte: {
    type: String,
    maxlength: [500, 'El motivo de reporte no puede exceder 500 caracteres']
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices
reviewSchema.index({ mentoraId: 1, visible: 1 });
reviewSchema.index({ estudianteId: 1 });
reviewSchema.index({ calificacion: -1 });

module.exports = mongoose.model('Review', reviewSchema);