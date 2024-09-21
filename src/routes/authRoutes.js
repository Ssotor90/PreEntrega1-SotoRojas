const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authMiddleware');


router.post('/register', authController.register);

router.post('/login', authController.login);


router.get('/current', verifyToken, (req, res) => {
    res.json(req.user);
});

module.exports = router;
