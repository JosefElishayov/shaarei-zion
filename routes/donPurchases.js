const express = require("express");
const { auth, authAdmin } = require("../middlewares/auth");
const { validateDonPurchase, DonPurchaseModel } = require("../models/donPurchasModel");
const router = express.Router();

router.get("/", async (req, res) => {
    res.json({ msg: "Api Work 400" });
})

router.post("/", auth, async (req, res) => {
    let validBody = validateDonPurchase(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let purchase = new DonPurchaseModel(req.body);
        purchase.user_id = req.tokenData._id;
        purchase.user_name = req.tokenData.name;
        purchase.token_id="1111";
        await purchase.save()

        res.status(201).json(purchase);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})

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