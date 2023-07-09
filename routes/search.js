const express= require("express");
const { BrunchesModel } = require("../models/brancheModel");
const { DonationsModel } = require("../models/donationsModel");
const router = express.Router();

router.get("/", async(req,res) => {
    const search = req.query.s;
    
    let findDb={}
    if(search){
        const searchExp = new RegExp(search,"i")
        findDb = {$or:[
            {brunch_name:searchExp},
            {donations_Name:searchExp},
            {address:searchExp},
            {city:searchExp},
            {manager:searchExp},
            {phone:searchExp},
            {email:searchExp},
            {description:searchExp},
            {info:searchExp},
            {info:searchExp},
            { news: { $elemMatch: { $regex: searchExp } } },     
        ]}
      }
    try{
      let branch = await BrunchesModel
      .find(findDb)
     
      let donation = await DonationsModel
      .find(findDb)
     
      res.json({branch,donation})
    }
    catch(err){
      console.log(err);
      res.status(502).json({err})
    }
})


module.exports = router;