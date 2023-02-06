const mongoose = require("mongoose");
const Joi = require("joi");

let helpedSchema = new mongoose.Schema({
status:String,
children:Number,
info:String,
user_id:String,
user_name:String,
date_create:{
type:Date , default:Date.now
},
})
exports.HelpedModel = mongoose.model("helpeds",helpedSchema)

exports.validateHelped = (_reqBody) => {
let joiSchema = Joi.object({
status:Joi.string().min(1).max(999).required(),
children:Joi.number().min(1).max(999).required(),
info:Joi.string().min(1).max(2500).required()
})
return joiSchema.validate(_reqBody)
}