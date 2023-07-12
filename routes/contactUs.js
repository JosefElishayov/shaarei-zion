const express= require("express");
const { ContactModel, validateContact, validateContactRegistered } = require("../models/contactModel");
const { UserModel } = require("../models/userModel");
const { auth, authAdmin } = require("../middlewares/auth");
const router = express.Router();
router.get("/",authAdmin, async(req,res) => {
  let perPage = Math.min(req.query.perPage, 20) || 10;
  let page = req.query.page - 1 || 0;
  let sort = req.query.sort || "_id"
  let reverse = req.query.reverse == "yes" ? 1 : -1;
  let user_id =req.query.user_id
  const search = req.query.s;
  try {
    let findDb={};
    if(user_id){findDb={user_id}}
    else if(search){
      const searchExp = new RegExp(search,"i")
      findDb = {$or:[{name:searchExp},{message:searchExp},{phone:searchExp},{email:searchExp}]}
    }
    let data = await ContactModel
      .find(findDb)
      .limit(perPage)
      .skip(page * perPage)
      .sort({ [sort]: reverse })
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})
router.get("/count", async(req,res) => {
  let perPage = Math.min(req.query.perPage, 20) || 10;
  try{
    let data = await ContactModel.countDocuments(perPage);
    
    
    res.json({count:data,pages:Math.ceil(data/perPage)})
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})
router.post("/registered",auth, async(req,res) => {
    let validBody = validateContactRegistered(req.body);
    if(validBody.error){
      return res.status(400).json(validBody.error.details);
    }
    try{
      let contact = new ContactModel(req.body);
      let user = await UserModel.findOne({_id: req.tokenData._id })
      contact.name = user.name;
      contact.phone = user.phone;
      contact.email = user.email;
      await contact.save();
      res.status(201).json(contact);
    }
    catch(err){
      console.log(err);
      res.status(502).json({err})
    }
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
  router.delete("/:id",authAdmin, async(req,res) => {
    try{
      let id = req.params.id;
      let data = await ContactModel.deleteOne({_id:id});
      res.json(data);
    }
    catch(err){
      console.log(err);
      res.status(502).json({err})
    }
  })
  router.patch("/changeStatus/:id/:status", authAdmin , async(req,res) => {
    try{
      const id = req.params.id;
      const newStatus = req.params.status;
      const data = await ContactModel.updateOne({_id:id},{status:newStatus})
      res.json(data);
    }
    catch(err){
      console.log(err);
      res.status(502).json({err})
    }
  })
module.exports = router;