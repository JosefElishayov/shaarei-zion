const express= require("express");
const bcrypt = require("bcrypt");
const {auth, authAdmin} = require("../middlewares/auth")
const {UserModel,validateUser, validateLogin, createToken, validateEditUser} = require("../models/userModel")
const router = express.Router();


router.get("/", async(req,res) => {
  res.json({msg:"Users work"});
})

router.get("/usersList",authAdmin, async(req,res) => {
  let perPage = Math.min(req.query.perPage, 20) || 20;
  let page = req.query.page - 1 || 0;
  let sort = req.query.sort || "_id"
  let reverse = req.query.reverse == "yes" ? 1 : -1
  try {
    let findDb={};
    const search = req.query.s;
    if(search){
      const searchExp = new RegExp(search,"i")
      findDb = {$or:[{name:searchExp},{email:searchExp},{phone:searchExp},{address:searchExp},{role:searchExp}]}
    }
    let data = await UserModel
      .find(findDb,{password:0})
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


router.get("/userInfo", auth , async(req,res) => {
  try{
    let user = await UserModel.findOne({_id:req.tokenData._id},{password:0});
    res.json(user);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})
router.get("/count", async(req,res) => {
  let perPage = Math.min(req.query.perPage, 20) || 10;
  try{
    let data = await UserModel.countDocuments(perPage);
    res.json({count:data,pages:Math.ceil(data/perPage)})
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})
router.get("/checkToken", auth,async(req,res) => {
  try{
    res.json(req.tokenData);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})
// sign up
router.post("/", async(req,res) => {
  let validBody = validateUser(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  try{
    let user = new UserModel(req.body)
    user.password = await bcrypt.hash(user.password, 10);
    await user.save();
    user.password = "***"
    res.json(user);
  }
  catch(err){
    if(err.code == 11000){
      return res.status(400).json({msg:"Email already in system",code:11000})
    }
    console.log(err);
    res.status(502).json({err})
  }
})
router.patch("/changeRole/:id/:role", authAdmin , async(req,res) => {
  try{
    const id = req.params.id;
    const newRole = req.params.role;
    if(id == req.tokenData._id || id == "6421f7da12f5ea125d82104d"){
      return res.status(401).json({err:"You cant change your user role or the super admin"})
    }
    const data = await UserModel.updateOne({_id:id},{role:newRole})
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})
router.patch("/changeEdit/:id/:editBranch", authAdmin , async(req,res) => {
  try{
    const id = req.params.id;
    const newEdit = req.params.editBranch;
    const data = await UserModel.updateOne({_id:id},{editBranch:newEdit})
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})
router.patch("/changePass/:id/:password", auth,async (req, res) => {
  try {
    const id = req.params.id;
    let pass = req.params.password;
   pass = await bcrypt.hash(pass, 10);
    const data = await UserModel.updateOne({ _id: id }, { password: pass });
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});
  router.put("/:id",auth, async(req,res) => {
    let validBody = validateEditUser(req.body);
    if(validBody.error){
      return res.status(400).json(validBody.error.details);
    }
    try{
      let id = req.params.id;
      let data = await UserModel.updateOne({_id:id},req.body);
      res.json(data);
    }
    catch(err){
      console.log(err);
      res.status(502).json({err})
    }
  })
router.post("/login", async(req,res) => {
  let validBody = validateLogin(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  try{
    let user = await UserModel.findOne({email:req.body.email})
    if(!user){
      return res.status(401).json({msg:"Email Worng."})
    }
    let validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword){
      return res.status(401).json({msg:"Password Worng."})
    }
    // לשלוח טוקן
    let token = createToken(user._id,user.role )
    
    res.json({token,role:user.role})
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})
module.exports = router;