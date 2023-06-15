const express= require("express");
const { authBranchManager, authAdmin, auth } = require("../middlewares/auth");
const { validateBrunches, BrunchesModel } = require("../models/brancheModel");
const { UserModel } = require("../models/userModel");
const { date } = require("joi/lib");
const router = express.Router();


router.get("/", async(req,res) => {
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
      findDb = {$or:[{brunch_name:searchExp},{manager:searchExp},{phone:searchExp},{address:searchExp},{info:searchExp},{description:searchExp},{mews:searchExp}]}
    }
    let data = await BrunchesModel
      .find(findDb)
      // מגביל את כמות הרשומות המצוגות בשאילתא
      .limit(perPage)
      // skip -> כמה רשומות לדלג
      .skip(page * perPage)

      .sort({ [sort]: reverse })
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})
router.get("/all", async(req,res) => {
  try {
    let data = await BrunchesModel.find(req.body)
  res.json(data)
  } catch (error) {
    console.log(error);
    res.status(502).json({ error })
  }
  
})
router.get("/count", async(req,res) => {
  let perPage = Math.min(req.query.perPage, 20) || 10;
  try{
    let data = await BrunchesModel.countDocuments(perPage);
    console.log(data);
    
    res.json({count:data,pages:Math.ceil(data/perPage)})
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})
  // TODO: need to add auth of admin
  router.post("/" ,authAdmin, async(req,res) => {
    let validBody = validateBrunches(req.body);
    if(validBody.error){
      return res.status(400).json(validBody.error.details);
    }
    try{
      let branch = new BrunchesModel(req.body);
      await branch.save();
      res.status(201).json(branch);
    }
    catch(err){
      console.log(err);
      res.status(502).json({err})
    }
  })
  router.get("/single/:id", async(req,res) => {
    try{
      let data = await BrunchesModel.findOne({_id:req.params.id})
      res.json(data);
    }
    catch(err){
      console.log(err);
      res.status(502).json({err})
    }
  })
  router.put("/:id",auth, async(req,res) => {
    let validBody = validateBrunches(req.body);
    if(validBody.error){
      return res.status(400).json(validBody.error.details);
    }
    try{
      let id = req.params.id;
      let data = await BrunchesModel.updateOne({_id:id},req.body);
      res.json(data);
    }
    catch(err){
      console.log(err);
      res.status(502).json({err})
    }
  })

  router.delete("/:id",authAdmin, async(req,res) => {
    try{
      let id = req.params.id;
      let data = await BrunchesModel.deleteOne({_id:id});
      res.json(data);
    }
    catch(err){
      console.log(err);
      res.status(502).json({err})
    }
  })
 
  module.exports = router;


module.exports = router;

// const { v4: uuidv4 } = require('uuid');

// const id = uuidv4(); // Generates a random UUID

// const { v4: uuidv4 } = require('uuid');

// const id = uuidv4(); // Generates a random UUID

// console.log(id);





