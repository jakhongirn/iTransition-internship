const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("./auth");
const dbConnect = require("./dbConnect");
const User = require("./models/User");
require("dotenv").config();

const SECRET_TOKEN_KEY = process.env.SECRET_TOKEN_KEY;

const app = express();

app.use(bodyParser.json());

//connection of MongoDB remotely
dbConnect();

// Handle CORS rules
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
  });

// Use the signup routes

app.post("/api/v1/signup", async (req, res) => {
    //destructuring coming data
    const { name, email, password } = req.body;

    //checks if the user exist or not
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        return res.status(400).send({
            message: "User with this email already exist! Go to login page.",
        });
    }

    //hash the password coming from api
    const hashedPassword = await bcrypt.hash(password, 10);

    //Registered and login time
    const registeredAt = Date.now();
    const lastLoginTime = Date.now();

    //Creating User object and add all properties into this object
    const newUser = new User({
        name,
        email,
        password: hashedPassword,
        registeredAt,
        lastLoginTime,
    });

    newUser
        .save()
        .then((result) => {
            res.status(201).send({
                message: "User created successfully!"
            });
        })
        .catch((err) => {
            res.status(500).send({
                message: "Error creating user",
                err,
            });
        });
});

//Handling login endpoint
app.post("/api/v1/login", async (req, res) => {
    const { email, password } = req.body;

    const loginTime = Date.now();

    User.findOneAndUpdate(
        {
            email: email,
        },
        {
            lastLoginTime: loginTime,
        }
    )
        .then((user) => {
            bcrypt.compare(password, user.password).then((passwordCheck) => {
                if (!passwordCheck) {
                    return res.status(202).send({
                        message: "Password doesn't match",
                    });
                }

                if (user.status == false) {
                    return res.status(203).send({
                        message: "User has been blocked. Try to login with another account"
                    })
                }

                //Keeps the datetime of last login

                //Generating token for authentication valid for a day
                const token = jwt.sign(
                    {
                        userId: user._id,
                        userEmail: user.email,
                    },
                    SECRET_TOKEN_KEY,
                    { expiresIn: "24h" }
                );

                res.status(200).send({
                    userId: user._id,
                    message: "Login successful!",
                    email: user.email,
                    name: user.name,
                    token,
                });
            });
        })
        .catch((err) => {
            res.status(400).send({
                message: "User with this email is not registered!",
                err,
            });
        });
});

app.get("/api/v1/users", auth, (req, res) => {
    User.find()
        .then((users) => {
            const usersList = users.map((user) => {
                return {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    lastLoginTime: user.lastLoginTime,
                    registeredAt: user.registeredAt,
                    status: user.status,
                };
            });
            res.status(200).json(usersList);
        })
        .catch((err) => {
            res.status(500).send({
                message: "Error: ",
                err,
            });
        });
});

//Update the status of multiple users

app.post("/api/v1/users/updateMany/", auth, (req, res) => {
    const { arrayIds, status } = req.body;

    const updates = arrayIds.map((id) => {
        return {
            updateOne: {
                filter: { _id: id },
                update: { $set: { status: status } },
            },
        };
    });

    User.bulkWrite(updates)
        .then((result) => {
            res.status(200).json({
                message: `Updated ${result.modifiedCount} documents.`,
            });
        })
        .catch((err) => {
            res.status(401).json({
                message: "Error 401",
                err,
            });
        });
});

//Delete specific user
app.delete("/api/v1/users/delete", (req, res) => {
    const { arrayIds } = req.body;

    const filter = { _id: { $in: arrayIds } };

    User.deleteMany(filter)
        .then((result) => {
            res.status(200).json({
                message: `Deleted ${result.deletedCount} documents`,
            });
        })
        .catch((err) => {
            res.status(500).json(err);
        });
});

// Start the server
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
