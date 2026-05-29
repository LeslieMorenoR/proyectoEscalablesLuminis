const mongoose = require('mongoose');

const mentorshipRequestSchema = new mongoose.Schema({
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
  mensaje: {
    type: String,
    required: [true, 'El mensaje es obligatorio'],
    maxlength: [1000, 'El mensaje no puede exceder 1000 caracteres']
  },
  estado: {
    type: String,
    enum: ['pendiente', 'aceptada', 'rechazada', 'completada', 'cancelada'],
    default: 'pendiente'
  },
  fechaSolicitud: {
    type: Date,
    default: Date.now
  },
  fechaRespuesta: {
    type: Date
  },
  fechaCompletada: {
    type: Date
  },
  motivoRechazo: {
    type: String,
    maxlength: [500, 'El motivo de rechazo no puede exceder 500 caracteres']
  },
  notas: {
    type: String,
    maxlength: [2000, 'Las notas no pueden exceder 2000 caracteres']
  },
  sesionesRealizadas: {
    type: Number,
    default: 0,
    min: 0
  },
  fechaMentoria: {
  type: Date
},
}, 
{
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices
mentorshipRequestSchema.index({ estudianteId: 1, estado: 1 });
mentorshipRequestSchema.index({ mentoraId: 1, estado: 1 });
mentorshipRequestSchema.index({ estado: 1, fechaSolicitud: -1 });

// Evitar solicitudes duplicadas pendientes
mentorshipRequestSchema.index(
  { estudianteId: 1, mentoraId: 1, estado: 1 },
  { 
    unique: true,
    partialFilterExpression: { estado: 'pendiente' }
  }
);

module.exports = mongoose.model('MentorshipRequest', mentorshipRequestSchema);