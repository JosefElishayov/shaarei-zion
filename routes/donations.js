const express = require("express");
const { authAdmin } = require("../middlewares/auth");
const { validateDonation, DonationsModel } = require("../models/donationsModel");
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
        findDb = {$or:[{donations_Name:searchExp},{info:searchExp}]}
      }
      let data = await DonationsModel
        .find(findDb)
        // מגביל את כמות הרשומות המצוגות בשאילתא
        .limit(perPage)
        // skip -> כמה רשומות לדלג
        .skip(page * perPage)
        // sort:{prop} 1 -> מהקטן לגדול , and -1 מהגדול לקטן
        // [] -> אומר לו לאסוף את המשתנה בסורט ולא לקחת אותו כמאפיין
        // reverse -> אחד או מינוס אחד
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
      let data = await DonationsModel.countDocuments(perPage);

      res.json({count:data,pages:Math.ceil(data/perPage)})
    }
    catch(err){
      console.log(err);
      res.status(502).json({err})
    }
  })
  router.get("/single/:id", async(req,res) => {
    try{
      let data = await DonationsModel.findOne({donations_Name:req.params.id})
      res.json(data);
    }
    catch(err){
      console.log(err);
      res.status(502).json({err})
    }
  })
router.post("/", authAdmin, async (req, res) => {
    let validBody = validateDonation(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let donations = new DonationsModel(req.body);
        donations.user_id = req.tokenData._id;
        await donations.save();
        res.status(201).json(donations);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
});
router.get("/single/:id", async(req,res) => {
    try{
      let data = await DonationsModel.findOne({_id:req.params.id})
      res.json(data);
    }
    catch(err){
      console.log(err);
      res.status(502).json({err})
    }
  })
router.put("/:id", authAdmin, async (req, res) => {
    let validBody = validateDonation(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let id = req.params.id;
        let data = await DonationsModel.updateOne({ _id: id }, req.body);
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})
router.delete("/:id", authAdmin, async (req, res) => {
    try {
        let id = req.params.id;
        let data = await DonationsModel.deleteOne({ _id: id });
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})

module.exports = router;