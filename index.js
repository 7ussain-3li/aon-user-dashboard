const express = require('express')
const app = express()
const admin = require('./routes/admin')
const products = require('./routes/product')
const user = require('./routes/user')
const order = require('./routes/order')
const verifyToken = require('./middleware')
const fileUpload = require('express-fileupload')

const port = 3000
app.use(express.json())
app.use(fileUpload({
  limits: {fileSize: 50 * 1024 * 124}
}))

app.use('/products', verifyToken, products)
app.use('/admin', admin)
app.use('/user', user)
app.use('/order', order)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})