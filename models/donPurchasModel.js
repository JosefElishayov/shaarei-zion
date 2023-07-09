const mongoose = require("mongoose");
const Joi = require("joi");

let donPurchaseSchema = new mongoose.Schema({
    price: Number,
    comments: String,
    phone: String,
    email: String,
    user_id: {
        type: String, default: null
    },
    user_name: String,
    status: {
        type: String, default: "לא שולם"
    },
    token_id: {
        type: String, default: null
    },
    date_create: {
        type: Date, default: Date.now
    },
    
})
exports.DonPurchaseModel = mongoose.model("donPurchases", donPurchaseSchema)

exports.validateDonPurchaseInside = (_reqBody) => {
    let joiSchema = Joi.object({
        price: Joi.number().min(1).max(80000).required(),
        comments: Joi.string().min(1).max(2000).allow(null,"")
    })
    return joiSchema.validate(_reqBody)
}
exports.validateDonPurchaseOut = (_reqBody) => {
    let joiSchema = Joi.object({
        price: Joi.number().min(1).max(80000).required(),
        comments: Joi.string().min(1).max(2000).allow(null,""),
        email: Joi.string().min(1).max(2000).required(),
        user_name: Joi.string().min(1).max(2000).required(),
        phone: Joi.string().min(1).max(2000).required()
    })
    return joiSchema.validate(_reqBody)
}