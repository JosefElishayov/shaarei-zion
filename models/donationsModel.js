const mongoose = require("mongoose");
const Joi = require("joi");

let donationsSchema = new mongoose.Schema({

donations_Name:String,
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
donations_Name:Joi.string().min(2).max(100).required(),
info:Joi.string().min(2).max(1500).required(),
price:Joi.number().min(1).max(100000).required(),
img_url:Joi.string().min(1).max(999).allow(null,""),
})
return joiSchema.validate(_reqBody)
}