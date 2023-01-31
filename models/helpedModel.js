const mongoose = require("mongoose");
const Joi = require("joi");

let helpedSchema = new mongoose.Schema({
status:Boolean,
children:Number,
info:String,
user_id:String,
date_create:{
type:Date , default:Date.now
},
})
exports.HelpedModel = mongoose.model("helpeds",helpedSchema)

exports.validateHelped = (_reqBody) => {
let joiSchema = Joi.object({
status:Joi.boolean().min(1).max(999).required(),
children:Joi.number().min(1).max(999).required(),
info:Joi.string().min(1).max(2500).required(),
date_create:Joi.date().min(1).max(999).required(),
})
return joiSchema.validate(_reqBody)
}