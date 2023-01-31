const mongoose = require("mongoose");
const Joi = require("joi");

let donationsSchema = new mongoose.Schema({
idSort:Number,
Donations_Name:String,
cat_url:String,
info:String,
price:Number,
img_url:String,
date_Created:{
type:Date , default:Date.now
},
})
exports.DonationsModel = mongoose.model("donations",donationsSchema)

exports.validateDonation = (_reqBody) => {
let joiSchema = Joi.object({
idSort:Joi.number().min(4).max(10).required(),
Donations_Name:Joi.string().min(2).max(100).required(),
cat_url:Joi.string().min(1).max(150).required(),
info:Joi.string().min(2).max(1500).required(),
price:Joi.number().min(1).max(100).required(),
img_url:Joi.string().min(1).max(999).allow(null,""),
date_Created:Joi.date().min(1).max(999).required(),
})
return joiSchema.validate(_reqBody)
}