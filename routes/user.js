const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware');

const {register, login, productView, productViewId, addOrder} = require('../module/user');

router.post('/register', register);
router.post('/login', login);
router.get('/products', verifyToken ,productView);
router.get('/product/:id', verifyToken ,productViewId);
router.post('/addOrder', verifyToken, addOrder);

module.exports = router;
