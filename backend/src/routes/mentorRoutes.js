const express = require('express');
const router = express.Router();

const {
  getMentors,
  getMentorById,
  createMentor,
  getMyMentorProfile,
  updateMentor,
  approveMentor,
  rejectMentor,
  deleteMentor,
  
} = require('../controllers/mentorController');

const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');


// =========================
// RUTA ESPECIAL PRIMERO
// =========================

router.get(
  '/profile/me',
  protect,
  authorize('mentora'),
  getMyMentorProfile
);


// =========================
// RUTAS PÚBLICAS
// =========================

router.get('/', getMentors);

router.get('/:id', getMentorById);


// =========================
// RUTAS PRIVADAS
// =========================

router.post(
  '/',
  protect,
  authorize('mentora'),
  createMentor
);

router.put(
  '/:id',
  protect,
  authorize('mentora'),
  updateMentor
);

router.put(
  '/:id/approve',
  protect,
  authorize('administrador'),
  approveMentor
);

router.put(
  '/:id/reject',
  protect,
  authorize('administrador'),
  rejectMentor
);

router.delete(
  '/:id',
  protect,
  deleteMentor
);

module.exports = router;