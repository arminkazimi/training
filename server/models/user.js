const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');


let UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{value} is not a valid email'
        }
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            require: true
        },
        token: {
            type: String,
            require: true
        }
    }]
});

// UserSchema.methods.toJSON = function () {
//
//     let user = this;
//     let userObject = user.toObject();
//
//     return _.pick(userObject, ['_id', 'email']);
// };

UserSchema.methods.generateAuthToken = function ()  {
    let user = this;
    let access = 'auth';
    let token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

    user.tokens.push({access, token});
    // console.log(token);

    user.save().then(() => {
        return token;
    });
    return token;
};

let User = mongoose.model('User', UserSchema);

module.exports = {User};