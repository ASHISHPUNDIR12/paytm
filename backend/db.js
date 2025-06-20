const mongoose = require("mongoose");
require('dotenv').config();

mongoose.connect(
  process.env.MONGODB_URL
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
  