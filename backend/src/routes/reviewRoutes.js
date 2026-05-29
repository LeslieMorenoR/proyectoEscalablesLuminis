const express = require('express');
const router = express.Router();
const {
  getReviewsByMentor,
  getReviewById,
  createReview,
  updateReview,
  toggleVisibility,
  deleteReview
} = require('../controllers/reviewController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize, adminOnly } = require('../middlewares/roleMiddleware');

// Rutas públicas
router.get('/mentor/:mentorId', getReviewsByMentor);
router.get('/:id', getReviewById);

// Rutas protegidas
router.post('/', protect, authorize('estudiante'), createReview);
router.put('/:id', protect, authorize('estudiante'), updateReview);
router.delete('/:id', protect, deleteReview);

// Rutas de admin
router.put('/:id/visibility', protect, adminOnly, toggleVisibility);

module.exports = router;