const mongoose = require("mongoose");
const Joi = require("joi")

const ContactSchema = new mongoose.Schema({
    name: String,
    phone:String,
    email:String,
    message:String,
    status: {
        type: String, default: "בטיפול"
      },
    date_created: {
        type: Date, default: Date.now
    }
})

exports.ContactModel = mongoose.model("contacts", ContactSchema);

exports.validateContact = (_reqBody) => {
    let joiSchema = Joi.object({
        name: Joi.string().min(1).max(150).required(),
        email: Joi.string().min(2).max(150).email().required(),
        phone: Joi.string().min(9).max(20).required(),
        message: Joi.string().min(1).max(2000).required()
       
    })
    return joiSchema.validate(_reqBody);
}
exports.validateContactRegistered = (_reqBody) => {
    let joiSchema = Joi.object({
        message: Joi.string().min(1).max(2000).required()     
    })
    return joiSchema.validate(_reqBody);
}