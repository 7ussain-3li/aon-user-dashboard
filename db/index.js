require("dotenv").config();
const {Client} = require("pg");

const client = new Client({
    connectionString: process.env.DATABASE_CONNECTION,
    ssl: {
        rejectUnauthorized: false
    }
})

client
    .connect()
    .then(() => console.log("Database connected"))
    .catch((err) => console.log("Error", err))

module.exports = client