const mongoose = require("mongoose");
const Joi = require("joi");


let schema = new mongoose.Schema({
brunch_name:String,
address:String,
images:Array,
imgHeder:String,
manager:String,
news:Array,
map:{
    len:Number,wid:Number
} ,
phone:String,
email:String,
description:String,
info:String,
})
exports.BrunchesModel = mongoose.model("brunches",schema)

exports.validateBrunches = (_reqBody) => {
let joiSchema = Joi.object({
brunch_name:Joi.string().min(1).max(999).required(),
address:Joi.string().min(1).max(999).required(),
images:Joi.array().min(0).max(999).allow(null,""),
imgHeder:Joi.string().min(0).max(999).allow(null,""),
manager:Joi.string().min(1).max(999).required(),
map:Joi.object().min(1).max(999).required(),
news:Joi.array().min(1).max(999).allow(null,""),
phone:Joi.string().min(9).max(20).required(),
email:Joi.string().min(5).max(50).allow(null,""),
description:Joi.string().min(1).max(999).required(),
info:Joi.string().min(1).max(5000).required(),
})
return joiSchema.validate(_reqBody)
}