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


app.post("/api/v1/signup", async (req, res) => {

    //destructuring coming data
    const {name, email, password} = req.body

    //checks if the user exist or not
    const existingUser = await User.findOne({email})

    if (existingUser) {
        return res.status(400).send({
            message: "User with this email already exist! Go to login page."
        })
    }

    //hash the password coming from api
    const hashedPassword = await bcrypt.hash(password, 10)
    
    const newUser = new User({name, email, password: hashedPassword})

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

app.post('/api/v1/login', async (req, res) => {
    const {email, password} = req.body;

    User.findOne({
        email: email
    })
    .then((user) => {
        bcrypt.compare(password, user.password)
        .then((passwordCheck) => {
            if(!passwordCheck) {
                return res.status(400).send({
                    message: "Password doesn't match"
                })
            }
            res.status(200).send({
                message: "Login successful!",
                email: user.email,
                name: user.name
            })
        })
    })
    
    .catch((err) => {
        res.status(400).send({
            message: "User with this email is not registered!",
            err
        })
    })
    
})


// Start the server

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

