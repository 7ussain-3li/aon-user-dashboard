const express = require('express');
const router = express.Router();
const {orderView, editOrder} = require('../module/order');

router.get('/view', orderView);
router.put('/changeStatus/:id', editOrder);

module.exports = router