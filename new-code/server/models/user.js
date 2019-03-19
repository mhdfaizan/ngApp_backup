const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const userScheme = new Schema({
    email: String,
    password: String
});

module.exports = mongoose.model('user', userScheme, 'users');