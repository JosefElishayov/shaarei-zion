const indexR = require("./index");
const usersR = require("./users");
const contactUsR=require("./contactUs");
const brunchesR=require("./branches");
const donationR=require("./donations");
const helpedsR=require("./helpeds");
const donPurchasesR=require("./donPurchases");



exports.routesInit = (app) => {
  app.use("/",indexR);
  app.use("/users",usersR);
  app.use("/contact",contactUsR);
  app.use("/branches",brunchesR);
  app.use("/donations",donationR);
  app.use("/helpeds",helpedsR);
  app.use("/purchase",donPurchasesR
  );

}