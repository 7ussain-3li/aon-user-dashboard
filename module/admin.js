const client = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function register(req, res) {
    const { name, department, username, password } = req.body;
    try {
        const hash = bcrypt.hashSync(password, 10);
        const adminData = await client.query(
            "SELECT * FROM admins"
        );
        console.log(adminData.rows);
        const findUser = adminData.rows.find(
            el => el.username === username
        );


        if (findUser) {
            res.send({
                success: false,
                message: "username already exists, Please try again"
            });
        } else {
            const insertData = await client.query(
                `INSERT INTO admins(name, department, username, password) VALUES('${name}', '${department}', '${username}', '${hash}') RETURNING *`);
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
    const adminData = await client.query(
        `SELECT * FROM admins WHERE username='${username}'`
    );
    if (adminData.rows.length === 0) {
        res.send({
            success: false,
            message: "username not found"
        });
    }else {
        let user = adminData.rows[0];
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

module.exports = { register, login }