const client = require('../db');

async function orderView(req, res) {
    const result = await client.query(
        `SELECT * FROM orders`  
    )
    res.send(result.rows)
}

async function editOrder(req, res) {
    let id = req.params.id;
    const status = req.body.status;

    if (status === "PENDING" || status === "PREPARING " || status === "DELIVERED"){
        const result = await client.query(
            `UPDATE orders SET status = '${status}' WHERE id = ${id} RETURNING *`
        )
        res.send({
            success: true,
            product: result.rows
        })
    } else {
        res.send({
            success: false,
            product: "The status type is not correct"
        })
    }
}

module.exports = { orderView, editOrder }