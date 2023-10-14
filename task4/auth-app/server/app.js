const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('./auth')
const dbConnect = require('./dbConnect');
const User = require('./models/User');
require('dotenv').config();

const SECRET_TOKEN_KEY = process.env.SECRET_TOKEN_KEY

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

//Handling login endpoint
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

            //Generating token for authentication valid for a day
            const token = jwt.sign({
                userId: user._id,
                userEmail: user.email
            },  SECRET_TOKEN_KEY,
                {expiresIn: '24h'}
            )

            res.status(200).send({
                message: "Login successful!",
                email: user.email,
                name: user.name,
                token
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

app.get('/users', auth,  (req, res) => {
    // User.find()
    // .then((users) => {
    //     res.status(200).send(users)
    // })
    // .catch((err) => {
    //     res.status(500).send({
    //         message: "Error: ",
    //         err
    //     })
    // })

    res.json({ message: "You are authorized to access me" });
})

// Start the server

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
