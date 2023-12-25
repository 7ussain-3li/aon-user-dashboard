const jwt = require('jsonwebtoken');

async function verifyToken(req, res, next) {
    let token = req.headers.token;
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).send({ success: false, message: "Unauthorized" });
        }
        next();
    })
}

module.exports = verifyToken