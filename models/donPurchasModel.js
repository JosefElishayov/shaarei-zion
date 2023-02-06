const mongoose = require("mongoose");
const Joi = require("joi");

let donPurchaseSchema = new mongoose.Schema({
id_donations:Number,
name:String,
price:Number,
comments:String,
user_id:String,
user_name:String,
token_id:String,
date_create:{
type:Date , default:Date.now
},
})
exports.DonPurchaseModel = mongoose.model("donPurchases",donPurchaseSchema)

exports.validateDonPurchase = (_reqBody) => {
let joiSchema = Joi.object({
name:Joi.string().min(1).max(50).required(),
price:Joi.number().min(1).max(999).required(),
comments:Joi.string().min(1).max(2000).required()
})
return joiSchema.validate(_reqBody)
}