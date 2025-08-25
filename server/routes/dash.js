const express = require('express');
const router = express.Router();
const { validateToken } = require('../middlewares/validateToken');

router.get('/', validateToken, (req, res) => {
    res.status(200).json({ 
        message: 'Welcome to the dashboard!',
        user: req.user 
    });
});

module.exports = router