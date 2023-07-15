const express = require("express");
const { auth, authAdmin } = require("../middlewares/auth");
const { DonPurchaseModel, validateDonPurchaseInside, validateDonPurchaseOut } = require("../models/donPurchasModel");
const { UserModel } = require("../models/userModel");
const router = express.Router();
router.get("/",auth, async(req,res) => {
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
        findDb = {$or:[{user_name:searchExp},{comments:searchExp},{phone:searchExp},{email:searchExp}],       
    }
      }
      let data = await DonPurchaseModel
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
  router.get("/count",  async(req,res) => {
    let perPage = Math.min(req.query.perPage, 20) || 10;
    try{
      let data = await DonPurchaseModel.countDocuments(perPage);
      res.json({count:data,pages:Math.ceil(data/perPage)})
    }
    catch(err){
      console.log(err);
      res.status(502).json({err})
    }
  })
router.post("/", auth, async (req, res) => {
    let validBody = validateDonPurchaseInside(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let purchase = new DonPurchaseModel(req.body);
        let user = await UserModel.findOne({_id:req.tokenData._id})
        purchase.user_id = user._id;
        purchase.user_name = user.name;
        purchase.phone = user.phone;
        purchase.email = user.email;  
      
        await purchase.save()
        res.status(201).json(purchase);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})
router.post("/out", async (req, res) => {
  let validBody = validateDonPurchaseOut(req.body);
  if (validBody.error) {
      return res.status(400).json(validBody.error.details);
  }
  try {
      let purchase = new DonPurchaseModel(req.body);
      await purchase.save()
      res.status(201).json(purchase);
  }
  catch (err) {
      console.log(err);
      res.status(502).json({ err })
  }
})
router.patch("/paid/:id/:status", async (req, res) => {
  try {
    const id = req.params.id;
    let paid = req.params.status;
    const data = await DonPurchaseModel.updateOne({ _id: id }, { status: paid });
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});
router.delete("/:id", authAdmin, async (req, res) => {
    try {
        let id = req.params.id;
        let data = await DonPurchaseModel.deleteOne({ _id: id });
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})

module.exports = router;
// { km: { $eq: Number(searchT) } }
// { 'tenant_name.name': sExp },