const mongoose = require('mongoose')
const Schema = mongoose.Schema


const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: [true, 'please provide an email']
       },
    password: {
        type: String,
        required: [true, 'please provide a password'],
        minLength: 6
       },
}, {timestamps: true})

module.exports = mongoose.model('User', userSchema);