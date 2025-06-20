const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://ashish:ANSOBHAI94@cluster0.hjsjb.mongodb.net/paytmUsers"
);

// letss define the schema

const userTable = mongoose.Schema(
    {
        username : String ,
        password : String , 
        firstName : String , 
        lastName : String
    }
);

//  define the modal
const Users = mongoose.model("Users", userTable);

module.exports =  {
  Users: Users,
};  
  