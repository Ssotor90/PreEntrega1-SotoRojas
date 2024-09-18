const express = require('express');
const router = express.Router();
const userController = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/register', userController.register);

router.post('/login', userController.login);

router.get('/current', verifyToken, (req, res) => {
    res.json(req.user);
});

module.exports = router;
