const express= require("express");
const { ContactModel, validateContact } = require("../models/contactModel");

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
    let data = await ContactModel
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