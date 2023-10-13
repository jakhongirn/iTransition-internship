const mongoose = require('mongoose');
require('dotenv').config();

const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;

async function dbConnect() {
    mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.mx92ork.mongodb.net/authDB?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("Successfully connected to MongoDB!"))
    .catch((err)=> console.log("Failed to connect to MongoDB: " + err))
}

module.exports = dbConnect;