const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');

const { authorize, adminOnly } = require('../middlewares/roleMiddleware');
const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getStats
} = require('../controllers/userController');

// Rutas protegidas - solo admin
router.use(protect);
router.use(authorize('administrador'));

router.get('/stats', getStats);
router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;