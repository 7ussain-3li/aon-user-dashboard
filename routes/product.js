const express = require('express')
const router = express.Router()
const {productView, addProduct, editProduct, deleteProduct} = require('../module/product')

router.get('/', productView)
router.post('/add', addProduct)
router.put('/edit/:id', editProduct)
router.delete('/delete/:id', deleteProduct)

module.exports = router