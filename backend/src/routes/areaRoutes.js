const express = require('express');
const router = express.Router();
const {
  getAreas,
  getAreaById,
  createArea,
  updateArea,
  deleteArea
} = require('../controllers/areaController');
const { protect } = require('../middlewares/authMiddleware');
const { adminOnly } = require('../middlewares/roleMiddleware');

// Rutas públicas
router.get('/', getAreas);
router.get('/:id', getAreaById);

// Rutas de admin
router.post('/', protect, adminOnly, createArea);
router.put('/:id', protect, adminOnly, updateArea);
router.delete('/:id', protect, adminOnly, deleteArea);

module.exports = router;