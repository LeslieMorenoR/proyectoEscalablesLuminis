const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { authorize} = require('../middlewares/roleMiddleware');
const {
  getStudents,
  getStudentById,
  createStudent,
  getMyStudentProfile,
  updateStudent
} = require('../controllers/studentController');

router.use(protect);

// Rutas públicas para estudiantes
router.get('/me', getMyStudentProfile);
router.post('/', createStudent);
router.put('/:id', updateStudent);

// Rutas admin
router.get('/', authorize('administrador'), getStudents);
router.get('/:id', getStudentById);

module.exports = router;