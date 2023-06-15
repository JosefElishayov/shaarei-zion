const mongoose = require("mongoose");
const Joi = require("joi");

let donPurchaseSchema = new mongoose.Schema({
// id_donations:Number,

price:Number,
comments:String,
phone:String,
email:String,
user_id:String,
user_name:String,
token_id:String,
date_create:{
type:Date , default:Date.now
},
})
exports.DonPurchaseModel = mongoose.model("donPurchases",donPurchaseSchema)

exports.validateDonPurchaseInside = (_reqBody) => {
let joiSchema = Joi.object({
price:Joi.number().min(1).max(999).required(),
comments:Joi.string().min(1).max(2000).required()
})
return joiSchema.validate(_reqBody)
}
exports.validateDonPurchaseOut = (_reqBody) => {
    let joiSchema = Joi.object({
    price:Joi.number().min(1).max(999).required(),
    comments:Joi.string().min(1).max(2000).required(),
    email:Joi.string().min(1).max(2000).required(),
    user_name:Joi.string().min(1).max(2000).required(),
    phone:Joi.string().min(1).max(2000).required()
    })
    return joiSchema.validate(_reqBody)
    }