const express= require("express");
const { authBranchManager, authAdmin } = require("../middlewares/auth");
const { validateBrunches, BrunchesModel } = require("../models/brancheModel");
const router = express.Router();


router.get("/", async(req,res) => {
  let perPage = Math.min(req.query.perPage, 20) || 5;
  let page = req.query.page - 1 || 0;
  let sort = req.query.sort || "_id"
  // אם שווה יס יציג מהקטן לגדול ובברירת מחדל מהגדול לקטן
  let reverse = req.query.reverse == "yes" ? 1 : -1;
  let user_id =req.query.user_id
  try {
    let findDb={};
    if(user_id){findDb={user_id}}
    let data = await BrunchesModel
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
  router.put("/:id",authBranchManager, async(req,res) => {
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
  // ?user_id= &role=
// משנה תפקיד של משתמש
// router.patch("/role/", authAdmin, async(req,res) => {
//   try{
//     // ישנה את הרול של המשתמש שבקווארי של היוזר איי די
//     // לערך שנמצא בקווארי של רול
//     let user_id = req.query.user_id;
//     let role = req.query.role;
//     // לא מאפשר למשתמש עצמו לשנות את התפקיד שלו
//     // או לשנות את הסופר אדמין
//     if(user_id == req.tokenData._id || user_id == "63b13b2750267011bebf32be"){
//       return res.status(401).json({msg:"You try to change yourself or the superadmin , anyway you are stupid!"})
//     }
//     let data = await UserModel.updateOne({_id:user_id},{role:role})
//     res.json(data);
//   }
//   catch (err) {
//     console.log(err);
//     res.status(500).json(err);
//   }
// })
  module.exports = router;


module.exports = router;







