const express = require("express");
const { auth, authAdmin, authBranchManager } = require("../middlewares/auth");
const { BrunchesModel } = require("../models/brancheModel");
const { validateHelped, HelpedModel } = require("../models/helpedModel");
const { UserModel } = require("../models/userModel");
const router = express.Router();


router.get("/", async (req, res) => {
  let perPage = Math.min(req.query.perPage, 20) || 5;
  let page = req.query.page - 1 || 0;
  let sort = req.query.sort || "_id"
  // אם שווה יס יציג מהקטן לגדול ובברירת מחדל מהגדול לקטן
  let reverse = req.query.reverse == "yes" ? 1 : -1;
  let user_id = req.query.user_id
  try {
    let findDb = {};
    if (user_id) { findDb = { user_id } }
    let data = await HelpedModel
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

router.post("/", auth, async (req, res) => {
  let validBody = validateHelped(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let helped = new HelpedModel(req.body);
    let user = await UserModel.findOne({ _id: req.tokenData._id })
    helped.user_name = user.name;
    helped.user_id = req.tokenData._id;
    

    await helped.save()

    res.status(201).json(helped);
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})

router.delete("/:id", authAdmin, async (req, res) => {
  try {
    let id = req.params.id;
    let data = await HelpedModel.deleteOne({ _id: id });
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})
module.exports = router;