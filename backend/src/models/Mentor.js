const mongoose = require('mongoose');

const mentorSchema = new mongoose.Schema({
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  especialidades: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Area'
  }],
  experiencia: {
    type: Number,
    required: [true, 'Los años de experiencia son obligatorios'],
    min: [0, 'La experiencia no puede ser negativa']
  },
  educacion: {
    type: String,
    required: [true, 'La educación es obligatoria'],
    maxlength: [500, 'La educación no puede exceder 500 caracteres']
  },
  empresa: {
    type: String,
    maxlength: [200, 'El nombre de la empresa no puede exceder 200 caracteres']
  },
  puesto: {
    type: String,
    maxlength: [200, 'El puesto no puede exceder 200 caracteres']
  },
  linkedIn: {
    type: String,
    match: [/^https?:\/\/(www\.)?linkedin\.com\/.*$/, 'URL de LinkedIn inválida']
  },
  disponibilidad: {
    type: Boolean,
    default: true
  },
  calificacionPromedio: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalMentorias: {
    type: Number,
    default: 0,
    min: 0
  },
  aprobada: {
    type: Boolean,
    default: false
  },
  motivoRechazo: {
    type: String,
    maxlength: [500, 'El motivo de rechazo no puede exceder 500 caracteres']
  },
  fechaAprobacion: {
    type: Date
  },horariosDisponibles: [
    {
      fecha: {
        type: Date,
        required: true
      },

      disponible: {
        type: Boolean,
        default: true
      }
    }
  ]
}, 
{
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});


// Índices para búsquedas rápidas
mentorSchema.index({ aprobada: 1, disponibilidad: 1 });
mentorSchema.index({ especialidades: 1 });
mentorSchema.index({ calificacionPromedio: -1 });

module.exports = mongoose.model('Mentor', mentorSchema);