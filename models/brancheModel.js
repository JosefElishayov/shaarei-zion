const mongoose = require("mongoose");
const Joi = require("joi");


let schema = new mongoose.Schema({
brunch_name:String,
address:String,
img:String,
manager:String,
map:{
    len:Number,wid:Number
} ,
phone:String,
description:String,
info:String,
})
exports.BrunchesModel = mongoose.model("brunches",schema)

exports.validateBrunches = (_reqBody) => {
let joiSchema = Joi.object({
brunch_name:Joi.string().min(1).max(999).required(),
address:Joi.string().min(1).max(999).required(),
img:Joi.string().min(1).max(999).allow(null,""),
manager:Joi.string().min(1).max(999).required(),
map:Joi.object().min(1).max(999).required(),
phone:Joi.string().min(9).max(20).required(),
description:Joi.string().min(1).max(999).required(),
info:Joi.string().min(1).max(5000).required(),
})
return joiSchema.validate(_reqBody)
}