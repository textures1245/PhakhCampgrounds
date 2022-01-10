const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
})

//- PassportLocalMongoose will automatically plugin username and password to our model schema
userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', userSchema)