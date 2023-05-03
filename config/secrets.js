require("dotenv").config()
// console.log(process.env.USER_DB);



exports.config = {
    db_pass:process.env.PASS_DB,
    db_user:process.env.USER_DB,
    token_secret:process.env.TOKEN_SECRET,
    db_url:""
  }
  exports.cloudinary={
    clode_nane:"dxaafqtj9",
    API_KAI:"767889945327742",
    API_SECRET:"vCwnlw4FHeOE5d-1EQwx34bfsfc",
    
  }