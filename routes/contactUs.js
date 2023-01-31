const express= require("express");
const { ContactModel, validateContact } = require("../models/contactModel");

const router = express.Router();

router.get("/", async(req,res) => {
  res.json({msg:"Api Work contact"});
})

router.post("/",async(req,res) => {
    let validBody = validateContact(req.body);
    if(validBody.error){
      return res.status(400).json(validBody.error.details);
    }
    try{
      let contact = new ContactModel(req.body);
      await contact.save();
      res.status(201).json(contact);
    }
    catch(err){
      console.log(err);
      res.status(502).json({err})
    }
  })
module.exports = router;