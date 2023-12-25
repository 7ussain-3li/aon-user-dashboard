const client = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


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

async function productViewId(req, res) {
    let id = req.params.id;
    const result = await client.query(
        `SELECT * FROM products WHERE id = ${id}`
    );
    res.send(result.rows);
}

async function register(req, res) {
    const { name, username, password, phone } = req.body;
    try {
        const hash = bcrypt.hashSync(password, 10);
        const users = await client.query(
            "SELECT * FROM users"
        );
        const findUser = users.rows.find(
            el => el.username === username
        );


        if (findUser) {
            res.send({
                success: false,
                message: "username already exists, Please try again"
            });
        } else {
            const insertData = await client.query(
                `INSERT INTO users(name, username, password, phone) VALUES('${name}', '${username}', '${hash}', '${phone}') RETURNING *`);
                console.log(insertData.rows);
            res.send({
                success: true,
                message: insertData.rows[0]
            });
        }
    } catch (error) {
        console.log(error);
    }
}


async function login(req, res) {
    const {username, password} = req.body;
    const users = await client.query(
        `SELECT * FROM users WHERE username='${username}'`
    );
    if (users.rows.length === 0) {
        res.send({
            success: false,
            message: "username not found"
        });
    }else {
        let user = users.rows[0];
        let check = bcrypt.compareSync(password, user.password);
        if (check) {
            let token = jwt.sign(user, process.env.SECRET_KEY);
            res.send({
                success: true,
                token,
                user
            })
        }else {
            res.send({
                success: false,
                message: "password incorrect"
            })
        }
    }
}


async function addOrder(req, res) {
    try {
        const { productID, userID, address } = req.body;
        const product = await client.query(
            `SELECT * FROM products WHERE id = ${productID}`
        )
        const user = await client.query(
            `SELECT * FROM users WHERE id = ${userID}`
        )
        if(!user || !product || !address){
            return res.status(400).send({
                error: "Something went wrong",
            })
        }
        const OrderDate = new Date();
        const formmattedOrderDate = OrderDate.toISOString().slice(0, 19).replace('T', ' ');

        const result = await client.query(
            `INSERT INTO orders(items, userid, address, date, status) 
             VALUES($1::jsonb, $2, $3, $4, $5) RETURNING *`,
            [product.rows[0], userID, address, formmattedOrderDate, 'PENDING']
        );
        res.send({
            success: true,
            message: result.rows
        })
    } catch (error) {
        console.log(error);
    }
}


module.exports = {
    productView,
    productViewId,
    register,
    login,
    addOrder
}
