const express = require('express');
console.log('✅ requestRoutes cargadas');
const router = express.Router();

const {
  getRequests,
  getRequestById,
  createRequest,
  acceptRequest,
  rejectRequest,
  completeRequest,
  cancelRequest
} = require('../controllers/requestController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize} = require('../middlewares/roleMiddleware');

router.use(protect);

// Obtener solicitudes
router.get('/', getRequests);

// Obtener solicitud por ID
router.get('/:id', getRequestById);

// Crear solicitud
router.post(
  '/',
  authorize('estudiante'),
  createRequest
);

// Aceptar solicitud
router.put(
  '/:id/accept',
  authorize('mentora'),
  acceptRequest
);

// Rechazar solicitud
router.put(
  '/:id/reject',
  authorize('mentora'),
  rejectRequest
);

// Completar mentoría
router.put(
  '/:id/complete',
  completeRequest
);

// Cancelar solicitud
router.delete(
  '/:id',
  authorize('estudiante'),
  cancelRequest
);

module.exports = router;