const express= require("express");
const path = require("path");
const router = express.Router();

// העלאת קובץ
router.post("/", async(req,res) => {
  // req.Files -> מכיל את הקבצים שנשלח אליו
  // myFile -> השם של קיי שמכיל את הקובץ
  try{
    console.log(req.files.myFile);
    let myFile = req.files.myFile;
    // בודק שהקובץ לא שוקל מעל 5 מב
    if(myFile.size >= 1024*1024*5){
      return res.status(400).json({err:"File too big (max 5mb)"})
    }
    // סיומות שמרשה לעלות
    let exts_ar = [".png",".jpg",".jpeg"];
    if(!exts_ar.includes(path.extname(myFile.name))){
      return res.status(400).json({err:"File not allowed, just .jpg, .png"})
    }
    // .mv -> פונקציה שמעלה את הקובץ לכתובת של הרפמטר הראשון
    // בפרמטר השני מפעיל קולבק שמקבל פרמטר אירור אם יש
    myFile.mv("public/images/"+myFile.name, (err) => {
      if(err){ return res.status(400).json({err})}
      res.json({msg:"file upload"})
    })

  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})


module.exports = router;