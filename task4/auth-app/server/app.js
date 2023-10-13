const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const dbConnect = require('./dbConnect');
const User = require('./models/User');


const app = express();

app.use(bodyParser.json());

//connection of MongoDB remotely
dbConnect();

// Use the signup routes


app.post("/signup", async (req, res) => {
    //hash the password coming from api
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
                            
    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    })

    newUser.save()
    .then((result) => {
        res.status(201).send({
            message: 'User created successfully!',
            result
        })
    })
    .catch((err) => {
        res.status(500).send({
            message: 'Error creating user',
            err
        })
    }) 
} )


// Start the server

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

