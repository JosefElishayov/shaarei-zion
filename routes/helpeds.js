const express= require("express");
const { auth } = require("../middlewares/auth");
const { validateHelped, HelpedModel } = require("../models/helpedModel");
const router = express.Router();

router.get("/", async(req,res) => {
  res.json({msg:"Api Work 200"});
})
router.post("/", auth,async(req,res) => {
    let validBody = validateHelped(req.body);
    if(validBody.error){
      return res.status(400).json(validBody.error.details);
    }
    try{
      let helped = new HelpedModel(req.body);
      helped.user_id = req.tokenData._id;
      await helped.save();
      res.status(201).json(helped);
    }
    catch(err){
      console.log(err);
      res.status(502).json({err})
    }
  })
  

module.exports = router;