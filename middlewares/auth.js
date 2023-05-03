const jwt = require("jsonwebtoken");

const { config } = require("../config/secrets");


exports.auth = (req, res, next) => {
  let token = req.header("x-api-key");
  if (!token) {
    return res.status(401).json({ msg: "You must send token in the header to this endpoint" })
  }
  try {
    // בודק אם הטוקן תקין או בתקוף
    let decodeToken = jwt.verify(token, config.token_secret);
    // req -> יהיה זהה בכל הפונקציות שמורשרות באותו ראוטר
    req.tokenData = decodeToken;
    // לעבור לפונקציה הבאה בשרשור
    next();
  }
  catch (err) {
    return res.status(401).json({ msg: "Token invalid or expired" })
  }
}

exports.authAdmin = (req, res, next) => {
  let token = req.header("x-api-key");
  if (!token) {
    return res.status(401).json({ msg: "You must send token in the header to this endpoint for admin" })
  }
  try {
    // בודק אם הטוקן תקין או בתקוף
    let decodeToken = jwt.verify(token, config.token_secret);
    if (decodeToken.role != "admin") {
      return res.status(401).json({
        msg: "Just admin can be in this endpoint"
      })

    }
    req.tokenData = decodeToken;
    // לעבור לפונקציה הבאה בשרשור
    next();
  }
  catch (err) {
    return res.status(401).json({ msg: "Token invalid or expired" })
  }
}

exports.authBranchManager = async (req, res, next) => {
  let token = req.header("x-api-key");
  if (!token) {
    return res.status(401).json({ msg: "You must send token in the header to this endpoint" })
  }
  try {
    // בודק אם הטוקן תקין או בתקוף
    let decodeToken = jwt.verify(token, config.token_secret);
    
    
    // let branch = await BrunchesModel.findOne({ _id:decodeToken.editBranch })
    // &&decodeToken.name!=branch._id
    
    if (decodeToken.role != "branchManager") {
      return res.status(401).json({ msg: "Just Branch Manager can be in this endpoint" })
    }
    req.tokenData = decodeToken;
      // לעבור לפונקציה הבאה בשרשור
      next();
    
  }
  catch (err) {
    return res.status(401).json({ msg: "Token invalid or expired pleas" })
  }
}


