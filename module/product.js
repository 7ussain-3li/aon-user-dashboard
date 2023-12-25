const client = require("../db");
const { uploadFile } = require("@uploadcare/upload-client");

async function productView(req, res) {
    const searchIteam = req.query.searchIteam;
    const limit = req.query.limit || 10;
    const offset = req.query.offset || 0;

    let q = `SELECT * FROM products`;
    if (searchIteam) {
        q += ` WHERE name ILIKE '%${searchIteam}%'`;
    }
    q += ` LIMIT ${limit} OFFSET ${offset}`;
    const result = await client.query(q);
    res.send(result.rows);
}

async function addProduct(req, res) {
    const { name, price, discount, active } = req.body;
    const image = await uploadFile(req.files.file.data, {
        publicKey: process.env.UPLOAD_KEY,
        store: 'auto',
        metadata: {
            subsystem: 'uploader',
            pet: 'cat'
        }
    })

    const result = await client.query(
        `INSERT INTO products(name, price, discount, active, image) VALUES('${name}', ${price}, ${discount}, ${active}, '${image.cdnUrl}') RETURNING *`
    );
    res.send({
        success: true,
        message: result.rows[0]
    })
}

async function editProduct(req, res) {
    let id = req.params.id;
    const { name, price, discount, active } = req.body;
    const image = await uploadFile(req.files.file.data, {
        publicKey: process.env.UPLOAD_KEY,
        store: 'auto',
        metadata: {
            subsystem: 'uploader',
            pet: 'cat'
        }
    })

    const result = await client.query(
        `UPDATE products SET name = '${name}', price = ${price}, discount = ${discount}, active = ${active}, image = '${image.cdnUrl}' WHERE id = ${id} RETURNING *`
    );
    res.send({
        success: true,
        message: result.rows
    })
}

async function deleteProduct(req, res) {
    let id = req.params.id;
    const result = await client.query(
        `DELETE FROM products WHERE id = ${id} RETURNING *`
    );
    res.send({
        success: true,
        message: result.rows
    })
}

module.exports = { productView, addProduct, editProduct, deleteProduct }