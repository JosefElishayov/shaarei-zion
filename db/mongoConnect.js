const mongoose = require('mongoose');
const { config } = require('../config/secrets');

main().catch(err => console.log(err));

async function main() {
  // כדי למנוע הצגת אזהרה
  mongoose.set('strictQuery', false);
  // וזה לווינדוס 11
  await mongoose.connect(`mongodb+srv://${config.db_user}:${config.db_pass}@cluster0.hl6fkuc.mongodb.net/finalProject`);
  console.log("mongo atlas connect finalProject local");
  
  // use `await mongoose.connect('mongodb://user:password@localhost:27017/test');` if your database has auth enabled
}