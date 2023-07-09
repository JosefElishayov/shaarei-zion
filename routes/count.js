const express = require("express");
const { DonPurchaseModel } = require("../models/donPurchasModel");
const { BrunchesModel } = require("../models/brancheModel");
const { UserModel } = require("../models/userModel");
const router = express.Router();

router.get("/", async (req, res) => {

    try {
        const paid = "שולם"
        let purchases = await DonPurchaseModel.find({status: paid});
        let totalAmount =0;
        for (let i = 0; i < purchases.length; i++) {
            totalAmount += purchases[i].price;
        }
        let countBranch = await BrunchesModel.countDocuments();
        let countPurchases = await DonPurchaseModel.countDocuments({ status: paid });
        let countUsers = await UserModel.countDocuments();
        res.json({ countBranch, countPurchases, countUsers ,totalAmount})
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})

module.exports = router;