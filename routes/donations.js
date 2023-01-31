const express = require("express");
const { authAdmin } = require("../middlewares/auth");
const { validateDonation, DonationsModel } = require("../models/donationsModel");
const router = express.Router();

router.get("/", async (req, res) => {
    res.json({ msg: "Api Work Donation" });
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