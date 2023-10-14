const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type:String, required: true, unique: true},
    password: {type: String, required: true},
    lastLoginTime: {type: Date, default: null},
    registeredAt: {type: Date, default: null},
    status: {type: Boolean, default: true}
})

module.exports = mongoose.model.Users || mongoose.model('Users', userSchema)
