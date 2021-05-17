import mongoose from 'mongoose';
import Joi from 'joi';

const user = mongoose.Schema({
    displayName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 100
    },
    password: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    },

})
export const validateUser = (user) => {
    const schema = Joi.object({
        name: Joi.string().alphanum().min(3).max(30).required(),
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    });
    return schema.validateAsync(user)
}

export const userModal = mongoose.model('User', user);